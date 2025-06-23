package com.bariszengin.route_planner.transportation.dto;

import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.type.TransportationType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TransportationResponseDTO {

    private Long id;

    private TransportationType type;

    private LocationResponseDTO originLocation;

    private LocationResponseDTO destinationLocation;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}