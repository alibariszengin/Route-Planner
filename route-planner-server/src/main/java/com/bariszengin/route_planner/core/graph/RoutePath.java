package com.bariszengin.route_planner.core.graph;

import com.bariszengin.route_planner.transportation.dto.TransportationResponseDTO;
import lombok.Data;

import java.util.List;

@Data
public class RoutePath {
    List<TransportationResponseDTO> path;
    boolean hasFlight;
    int flightIndex;

    RoutePath(List<TransportationResponseDTO> path) {
        this.path = path;
        this.hasFlight = false;
        this.flightIndex = 0;
    }
}