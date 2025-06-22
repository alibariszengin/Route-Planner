package com.bariszengin.route_planner.location.mapper;

import com.bariszengin.route_planner.location.Location;
import com.bariszengin.route_planner.location.dto.LocationCreateDTO;
import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    Location toEntity(LocationCreateDTO locationDTO);

    //LocationCreateDTO toCreateDto(Location location);
    //LocationResponseDTO toResponseDto(Location location);

    List<LocationResponseDTO> toDtoList(List<Location> locations);
}
