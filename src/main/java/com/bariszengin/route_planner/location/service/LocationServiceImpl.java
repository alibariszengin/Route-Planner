package com.bariszengin.route_planner.location.service;

import com.bariszengin.route_planner.location.Location;
import com.bariszengin.route_planner.location.LocationRepository;
import com.bariszengin.route_planner.location.dto.LocationCreateDTO;
import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.location.dto.LocationUpdateDTO;
import com.bariszengin.route_planner.location.mapper.LocationMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    @Override
    public LocationResponseDTO createLocation(LocationCreateDTO locationDto) {
        Location location = this.locationMapper.toEntity(locationDto);
        this.locationRepository.save(location);
        return this.locationMapper.toResponseDto(location);
    }

    @Override
    public LocationResponseDTO updateLocation(LocationUpdateDTO locationDto) {
        Location location = getLocationEntity(locationDto.getId());
        this.locationMapper.updateLocationFromDto(locationDto, location);
        this.locationRepository.save(location);
        return this.locationMapper.toResponseDto(location);
    }

    @Override
    public Long deleteLocation(Long locationId) {
        this.locationRepository.deleteById(locationId);
        return locationId;
    }

    @Override
    public LocationResponseDTO getLocation(Long id) {
        Location location = getLocationEntity(id);
        return this.locationMapper.toResponseDto(location);
    }

    @Override
    public List<LocationResponseDTO> getLocations() {
        List<Location> locations = this.locationRepository.findAll();
        return this.locationMapper.toResponseDtoList(locations);
    }

    @Override
    public void validateLocations(List<Long> ids) {
        if (!areLocationsExists(ids)) {
            throw new EntityNotFoundException("Location not found for one or more of the given ids");
        }
    }

    private boolean areLocationsExists(List<Long> ids) {
        return this.locationRepository.countByIdIn(ids) == ids.size();
    }

    private Location getLocationEntity(Long id) {
        return this.locationRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Location not found with id: " + id)
        );
    }
}
