package com.bariszengin.route_planner.location.service;

import com.bariszengin.route_planner.location.Location;
import com.bariszengin.route_planner.location.LocationRepository;
import com.bariszengin.route_planner.location.dto.LocationCreateDTO;
import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.location.dto.LocationUpdateDTO;
import com.bariszengin.route_planner.location.mapper.LocationMapper;
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

    public LocationResponseDTO createLocation(LocationCreateDTO locationDto) {
        Location location = this.locationMapper.toEntity(locationDto);
        location = this.locationRepository.save(location);
        return this.locationMapper.toResponseDto(location);
    }

    public LocationResponseDTO updateLocation(LocationUpdateDTO locationDto) {
        Location location = this.locationRepository.findById(locationDto.getId()).orElseGet(null);
        this.locationMapper.updateLocationFromDto(locationDto, location);
        this.locationRepository.save(location);
        return this.locationMapper.toResponseDto(location);
    }

    public Long deleteLocation(Long locationId) {
        this.locationRepository.deleteById(locationId);
        return locationId;
    }


    public LocationResponseDTO getLocation(Long id) {
        return null;
    }

    public List<LocationResponseDTO> getLocations() {
        List<Location> locations = this.locationRepository.findAll();
        log.info(locations.toString());
        return this.locationMapper.toResponseDtoList(locations);
    }


}
