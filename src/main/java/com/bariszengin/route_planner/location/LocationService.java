package com.bariszengin.route_planner.location;

import com.bariszengin.route_planner.location.dto.LocationCreateDTO;
import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.location.mapper.LocationMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    public LocationResponseDTO createLocation(LocationCreateDTO locationDto) {
        Location location = this.locationMapper.toEntity(locationDto);
        location = this.locationRepository.save(location);
        return null; //this.locationMapper.toResponseDto(location);
    }

    public List<LocationResponseDTO> getLocations() {
        List<Location> locations = this.locationRepository.findAll();
        log.info(locations.toString());
        return this.locationMapper.toDtoList(locations);
    }
}
