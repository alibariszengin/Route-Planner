package com.bariszengin.route_planner.transportation.service;

import com.bariszengin.route_planner.core.exception.custom.ValidationException;
import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.location.service.LocationService;
import com.bariszengin.route_planner.transportation.Transportation;
import com.bariszengin.route_planner.transportation.TransportationRepository;
import com.bariszengin.route_planner.transportation.dto.RouteResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationCreateDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationUpdateDTO;
import com.bariszengin.route_planner.transportation.mapper.TransportationMapper;
import com.bariszengin.route_planner.type.TransportationType;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class TransportationServiceImpl implements TransportationService {

    private final TransportationRepository transportationRepository;
    private final TransportationMapper transportationMapper;
    private final LocationService locationService;

    @Override
    public TransportationResponseDTO createTransportation(TransportationCreateDTO dto, boolean populateAll) {

        validateLocations(dto.getDestinationLocationId(),  dto.getOriginLocationId());

        Transportation transportation = transportationMapper.toEntity(dto);
        transportationRepository.save(transportation);
        if (populateAll) {
            transportation = getTransportationEntityPopulated(transportation.getId());
        }
        return transportationMapper.toResponseDto(transportation);
    }

    @Override
    public TransportationResponseDTO updateTransportation(TransportationUpdateDTO dto, boolean populateAll) {
        Transportation transportation = getTransportationEntityPopulated(dto.getId());

        validateLocations(dto.getDestinationLocationId(),  dto.getOriginLocationId());

        transportationMapper.updateTransportationFromDto(dto, transportation);

        transportationRepository.save(transportation);
        if (populateAll) {
            transportation = getTransportationEntityPopulated(transportation.getId());
        }
        return transportationMapper.toResponseDto(transportation);
    }

    @Override
    public Long deleteTransportation(Long id) {
        transportationRepository.deleteById(id);
        return id;
    }

    @Override
    public TransportationResponseDTO getTransportation(Long id) {
        Transportation transportation = getTransportationEntityPopulated(id);
        return transportationMapper.toResponseDto(transportation);
    }

    @Override
    public List<TransportationResponseDTO> getTransportations() {
        List<Transportation> transportations = transportationRepository.findByAllWithLocation();
        return transportationMapper.toResponseDtoList(transportations);
    }

    @Override
    public List<RouteResponseDTO> getRoutes(Long originId, Long destinationId){
        validateLocations(originId, destinationId);
        LocationResponseDTO origin = locationService.getLocation(originId);
        LocationResponseDTO destination = locationService.getLocation(destinationId);

        List<RouteResponseDTO> validRoutes = new LinkedList<>();

        //Direct flight
        List<TransportationResponseDTO> directFlights = findDirectFlights(origin, destination);
        for (TransportationResponseDTO flight : directFlights) {
            validRoutes.add(new RouteResponseDTO(Arrays.asList(flight)));
        }

        //Before transfer + Flight
        validRoutes.addAll(findBeforeTransferRoutes(origin, destination));

        //Flight + After transfer
        validRoutes.addAll(findAfterTransferRoutes(origin, destination));

        //Before transfer + Flight + After transfer
        validRoutes.addAll(findFullRoutes(origin, destination));

        return validRoutes;
    }

    private void validateLocations(Long origin, Long destination) {
        if (origin.equals(destination)) {
            throw new ValidationException("Origin and destination locations can't be the same");
        }
        List<Long> locationIds = List.of(origin, destination);
        locationService.validateLocations(locationIds);
    }

    private Transportation getTransportationEntity(Long id) {
        return transportationRepository.findById(id)
                .orElseThrow(
                        () -> new EntityNotFoundException("Transportation not found with id: " + id)
                );
    }

    private Transportation getTransportationEntityPopulated(Long id) {
        return transportationRepository.findByIdWithLocation(id)
                .orElseThrow(
                        () -> new EntityNotFoundException("Transportation not found with id: " + id)
                );
    }

    private List<TransportationResponseDTO> findDirectFlights(LocationResponseDTO origin, LocationResponseDTO destination) {
        List<Transportation> transportations = transportationRepository.findByOriginLocationIdAndDestinationLocationId(origin.getId(), destination.getId())
                .stream()
                .filter(t -> t.getType() == TransportationType.FLIGHT)
                .toList();
        return transportationMapper.toResponseDtoList(transportations);
    }

    private List<RouteResponseDTO> findBeforeTransferRoutes(LocationResponseDTO origin, LocationResponseDTO destination) {
        List<RouteResponseDTO> routes = new ArrayList<>();

        List<Transportation> beforeTransfers = transportationRepository.findByAllWithLocation()
                .stream()
                .filter(t -> t.getOriginLocation().getId().equals(origin.getId()) && t.getType() != TransportationType.FLIGHT)
                .toList();

        for (Transportation beforeTransfer : beforeTransfers) {
            Long intermediateLocation = beforeTransfer.getDestinationLocation().getId();

            List<Transportation> flights = transportationRepository.findByOriginLocationIdAndDestinationLocationId(
                            intermediateLocation, destination.getId())
                    .stream()
                    .filter(t -> t.getType() == TransportationType.FLIGHT)
                    .toList();

            for (Transportation flight : flights) {
                TransportationResponseDTO flightDto = transportationMapper.toResponseDto(flight);
                TransportationResponseDTO beforeTransferDto = transportationMapper.toResponseDto(beforeTransfer);

                routes.add(new RouteResponseDTO(Arrays.asList(beforeTransferDto, flightDto)));
            }
        }

        return routes;
    }

    private List<RouteResponseDTO> findAfterTransferRoutes(LocationResponseDTO origin, LocationResponseDTO destination) {
        List<RouteResponseDTO> routes = new ArrayList<>();

        List<Transportation> flights = transportationRepository.findByAllWithLocation()
                .stream()
                .filter(t -> t.getOriginLocation().getId().equals(origin.getId()) && t.getType() == TransportationType.FLIGHT)
                .toList();

        for (Transportation flight : flights) {
            Long intermediateLocation = flight.getDestinationLocation().getId();

            List<Transportation> afterTransfers = transportationRepository.findByOriginLocationIdAndDestinationLocationId(
                            intermediateLocation, destination.getId())
                    .stream()
                    .filter(t -> t.getType() != TransportationType.FLIGHT)
                    .toList();

            for (Transportation afterTransfer : afterTransfers) {
                TransportationResponseDTO flightDto = transportationMapper.toResponseDto(flight);
                TransportationResponseDTO afterTransferDto = transportationMapper.toResponseDto(afterTransfer);

                routes.add(new RouteResponseDTO(Arrays.asList(flightDto, afterTransferDto)));
            }
        }

        return routes;
    }


    private List<RouteResponseDTO> findFullRoutes(LocationResponseDTO origin, LocationResponseDTO destination) {
        List<RouteResponseDTO> routes = new ArrayList<>();

        List<Transportation> beforeTransfers = transportationRepository.findByAllWithLocation()
                .stream()
                .filter(t -> t.getOriginLocation().getId().equals(origin.getId()) && t.getType() != TransportationType.FLIGHT)
                .toList();

        for (Transportation beforeTransfer : beforeTransfers) {
            Long firstIntermediate = beforeTransfer.getDestinationLocation().getId();

            List<Transportation> flights = transportationRepository.findByAllWithLocation()
                    .stream()
                    .filter(t -> t.getOriginLocation().getId().equals(firstIntermediate) && t.getType() == TransportationType.FLIGHT)
                    .toList();

            for (Transportation flight : flights) {
                Long secondIntermediate = flight.getDestinationLocation().getId();

                List<Transportation> afterTransfers = transportationRepository.findByOriginLocationIdAndDestinationLocationId(
                                secondIntermediate, destination.getId())
                        .stream()
                        .filter(t -> t.getType() != TransportationType.FLIGHT)
                        .toList();

                for (Transportation afterTransfer : afterTransfers) {
                    TransportationResponseDTO flightDto = transportationMapper.toResponseDto(flight);
                    TransportationResponseDTO afterTransferDto = transportationMapper.toResponseDto(afterTransfer);
                    TransportationResponseDTO beforeTransferDto = transportationMapper.toResponseDto(beforeTransfer);

                    routes.add(new RouteResponseDTO(Arrays.asList(beforeTransferDto, flightDto, afterTransferDto)));
                }
            }
        }

        return routes;
    }
}
