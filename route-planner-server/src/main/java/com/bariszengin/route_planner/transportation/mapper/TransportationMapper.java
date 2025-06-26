package com.bariszengin.route_planner.transportation.mapper;

import com.bariszengin.route_planner.transportation.Transportation;
import com.bariszengin.route_planner.transportation.dto.TransportationCreateDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationUpdateDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransportationMapper {

    Transportation toEntity(TransportationCreateDTO dto);

    TransportationResponseDTO toResponseDto(Transportation entity);

    void updateTransportationFromDto(TransportationCreateDTO dto, @MappingTarget Transportation entity);

    void updateTransportationFromDto(TransportationUpdateDTO dto, @MappingTarget Transportation entity);

    List<TransportationResponseDTO> toResponseDtoList(List<Transportation> entities);
}