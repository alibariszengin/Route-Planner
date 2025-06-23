package com.bariszengin.route_planner.location.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LocationUpdateDTO {

    @NotNull
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @Size(max = 50, message = "City must be less than 50 characters")
    private String city;

    @Size(max = 50, message = "Country must be less than 50 characters")
    private String country;

    @Size(max = 10, message = "Location code must be less than 10 characters")
    private String locationCode;
}
