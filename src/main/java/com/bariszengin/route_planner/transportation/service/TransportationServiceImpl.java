package com.bariszengin.route_planner.transportation.service;

import com.bariszengin.route_planner.location.service.LocationService;
import com.bariszengin.route_planner.transportation.Transportation;
import com.bariszengin.route_planner.transportation.TransportationRepository;
import com.bariszengin.route_planner.transportation.dto.TransportationCreateDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationUpdateDTO;
import com.bariszengin.route_planner.transportation.mapper.TransportationMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class TransportationServiceImpl implements TransportationService {

    private final TransportationRepository transportationRepository;
    private final TransportationMapper transportationMapper;
    private final LocationService locationService;

    @Override
    public TransportationResponseDTO createTransportation(TransportationCreateDTO dto) {

        validateLocations(dto.getDestinationLocationId(),  dto.getOriginLocationId());
        Transportation transportation = transportationMapper.toEntity(dto);

        transportationRepository.save(transportation);
        return transportationMapper.toResponseDto(transportation);
    }

    @Override
    public TransportationResponseDTO updateTransportation(TransportationUpdateDTO dto) {
        Transportation transportation = getTransportationEntity(dto.getId());

        validateLocations(dto.getDestinationLocationId(),  dto.getOriginLocationId());

        transportationMapper.updateTransportationFromDto(dto, transportation);

        transportationRepository.save(transportation);
        return transportationMapper.toResponseDto(transportation);
    }

    @Override
    public Long deleteTransportation(Long id) {
        transportationRepository.deleteById(id);
        return id;
    }

    @Override
    public TransportationResponseDTO getTransportation(Long id) {
        Transportation transportation = getTransportationEntity(id);
        return transportationMapper.toResponseDto(transportation);
    }

    @Override
    public List<TransportationResponseDTO> getTransportations() {
        List<Transportation> transportations = transportationRepository.findAll();
        return transportationMapper.toResponseDtoList(transportations);
    }

    private void validateLocations(Long origin, Long destination) {
        if (origin.equals(destination)) {
            //throw new ValidatonException();
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
}
