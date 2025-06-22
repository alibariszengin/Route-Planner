package com.bariszengin.route_planner.transportation.service;

import com.bariszengin.route_planner.transportation.dto.TransportationCreateDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationUpdateDTO;

import java.util.List;

public interface TransportationService {
    TransportationResponseDTO createTransportation(TransportationCreateDTO transportationDto);

    TransportationResponseDTO updateTransportation(TransportationUpdateDTO transportationDto);

    Long deleteTransportation(Long transportationId);

    List<TransportationResponseDTO> getTransportations();

    TransportationResponseDTO getTransportation(Long id);
}
