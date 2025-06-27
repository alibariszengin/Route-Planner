package com.bariszengin.route_planner.transportation.service;

import com.bariszengin.route_planner.core.exception.custom.ValidationException;
import com.bariszengin.route_planner.core.graph.RouteFinder;
import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.location.service.LocationService;
import com.bariszengin.route_planner.transportation.Transportation;
import com.bariszengin.route_planner.transportation.TransportationRepository;
import com.bariszengin.route_planner.transportation.dto.RouteResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationCreateDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationUpdateDTO;
import com.bariszengin.route_planner.transportation.mapper.TransportationMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

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
    public List<RouteResponseDTO> getRoutes(Long originId, Long destinationId, Integer dayOfWeek){
        validateLocations(originId, destinationId);
        LocationResponseDTO origin = locationService.getLocation(originId);
        LocationResponseDTO destination = locationService.getLocation(destinationId);

        RouteFinder routeFinder = new RouteFinder();
        List<TransportationResponseDTO> transportations = getTransportations();
        if (dayOfWeek != null) {
            transportations = transportations.stream().filter(transportation -> transportation.isWorkingOnGivenDay(dayOfWeek)).toList();
        }

        return routeFinder.findAllRoutes(origin, destination, transportations);
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
}
