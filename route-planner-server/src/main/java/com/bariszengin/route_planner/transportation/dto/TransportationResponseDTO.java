package com.bariszengin.route_planner.transportation.dto;

import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.type.TransportationType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class TransportationResponseDTO {

    private Long id;

    private TransportationType type;

    private LocationResponseDTO originLocation;

    private LocationResponseDTO destinationLocation;

    private String activeDays;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public List<Integer> getActiveDaysAsList() {
        if (activeDays == null || activeDays.isBlank()) return Collections.emptyList();
        return Arrays.stream(activeDays.split(","))
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }
    public boolean isActiveOnDate(int dayOfWeek) {
        return getActiveDaysAsList().contains(dayOfWeek);
    }
}