package com.bariszengin.route_planner.transportation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RouteResponseDTO {
    List<TransportationResponseDTO> transportations;
}
