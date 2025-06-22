package com.bariszengin.route_planner.transportation.dto;

import com.bariszengin.route_planner.type.TransportationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportationUpdateDTO {

    @NotNull(message = "Transportation ID is required")
    private Long id;

    @NotNull(message = "Origin location ID is required")
    private Long originLocationId;

    @NotNull(message = "Destination location ID is required")
    private Long destinationLocationId;

    @NotNull(message = "Transportation type is required")
    private TransportationType type;
}