package com.bariszengin.route_planner.location.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LocationResponseDTO {
    private Long id;
    private String name;
    private String city;
    private String country;
    private String locationCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
