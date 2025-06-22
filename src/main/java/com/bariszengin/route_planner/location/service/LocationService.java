package com.bariszengin.route_planner.location.service;

import com.bariszengin.route_planner.location.dto.LocationCreateDTO;
import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.location.dto.LocationUpdateDTO;

import java.util.List;

public interface LocationService {
    LocationResponseDTO createLocation(LocationCreateDTO locationDto);

    LocationResponseDTO updateLocation(LocationUpdateDTO locationDto);

    Long deleteLocation(Long locationId);

    List<LocationResponseDTO> getLocations();

    LocationResponseDTO getLocation(Long id);
}
