package com.bariszengin.route_planner.location.mapper;

import com.bariszengin.route_planner.location.Location;
import com.bariszengin.route_planner.location.dto.LocationCreateDTO;
import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.location.dto.LocationUpdateDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    Location toEntity(LocationCreateDTO dto);

    LocationResponseDTO toResponseDto(Location entity);

    List<LocationResponseDTO> toResponseDtoList(List<Location> entities);

    void updateLocationFromDto(LocationUpdateDTO dto, @MappingTarget Location entity);
}
