package com.bariszengin.route_planner.transportation;


import com.bariszengin.route_planner.core.dto.ResponseDTO;
import com.bariszengin.route_planner.transportation.dto.RouteResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationCreateDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationUpdateDTO;
import com.bariszengin.route_planner.transportation.service.TransportationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transportations")
@Slf4j
@AllArgsConstructor
public class TransportationController {

    private final TransportationService transportationService;

    @PostMapping
    public ResponseEntity<TransportationResponseDTO> createTransportation(
            @Valid @RequestBody TransportationCreateDTO createDTO,
            @RequestParam(name = "populateAll", required = false, defaultValue = "false") boolean populateAll
    ) {
        log.info("POST /api/v1/transportations - Creating transportation");
        TransportationResponseDTO response = transportationService.createTransportation(createDTO, populateAll);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping
    public ResponseEntity<TransportationResponseDTO> updateTransportation(
            @Valid @RequestBody TransportationUpdateDTO updateDTO,
            @RequestParam(name = "populateAll", required = false, defaultValue = "false") boolean populateAll
    ) {
        log.info("PUT /api/v1/transportations - Updating transportation id={}", updateDTO.getId());
        TransportationResponseDTO response = transportationService.updateTransportation(updateDTO, populateAll);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransportationResponseDTO> getTransportation(@PathVariable Long id) {
        log.info("GET /api/v1/transportations/{} - Fetching transportation by id", id);
        TransportationResponseDTO response = transportationService.getTransportation(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteTransportation(@PathVariable Long id) {
        log.info("DELETE /api/v1/transportations/{} - Deleting transportation by id", id);
        transportationService.deleteTransportation(id);
        ResponseDTO responseDTO = new ResponseDTO("Deleted Transportation with id: " + id);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<TransportationResponseDTO>> getTransportations() {
        log.info("GET /api/v1/transportations - Fetching all transportations");
        List<TransportationResponseDTO> response = transportationService.getTransportations();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/generateRoute")
    public ResponseEntity<List<RouteResponseDTO>> getRoutes(
            @RequestParam(name = "originLocation") Long originLocation,
            @RequestParam(name = "destinationLocation") Long destinationLocation,
            @RequestParam(name = "dayOfWeek", required = false) Integer dayOfWeek) {
        log.info("GET /api/v1/transportations/generateRoute - Generating routes");
        List<RouteResponseDTO> response = transportationService.getRoutes(originLocation, destinationLocation, dayOfWeek);
        return ResponseEntity.ok(response);
    }
}