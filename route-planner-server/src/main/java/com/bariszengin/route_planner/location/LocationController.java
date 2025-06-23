package com.bariszengin.route_planner.location;

import com.bariszengin.route_planner.location.dto.LocationCreateDTO;
import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.location.dto.LocationUpdateDTO;
import com.bariszengin.route_planner.location.service.LocationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locations")
@Slf4j
@AllArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<LocationResponseDTO> createLocation(@Valid @RequestBody LocationCreateDTO createDTO) {
        log.info("POST /api/v1/locations - Creating location: {}", createDTO.getName());
        LocationResponseDTO response = locationService.createLocation(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping
    public ResponseEntity<LocationResponseDTO> updateLocation(@Valid @RequestBody LocationUpdateDTO updateDTO) {
        log.info("PUT /api/v1/locations - Updating location: {}", updateDTO.getName());
        LocationResponseDTO response = locationService.updateLocation(updateDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<LocationResponseDTO> getLocation(@PathVariable Long id) {
        log.info("GET /api/v1/locations/ - Getting location by id");
        LocationResponseDTO location = locationService.getLocation(id);
        return ResponseEntity.ok(location);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<String> deleteLocation(@PathVariable Long id) {
        log.info("DELETE /api/v1/locations/ - Deleting location by id");
        locationService.deleteLocation(id);
        return ResponseEntity.ok("Deleted Location with id: " + id);
    }

    @GetMapping
    public ResponseEntity<List<LocationResponseDTO>> getLocations() {
        log.info("GET /api/v1/locations/ - Fetching locations");
        List<LocationResponseDTO> response = locationService.getLocations();
        return ResponseEntity.ok(response);
    }
//
//    @GetMapping("/code/{locationCode}")
//    public ResponseEntity<LocationResponseDTO> getLocationByCode(@PathVariable String locationCode) {
//        log.info("GET /api/v1/locations/code/{} - Fetching location", locationCode);
//        LocationResponseDTO response = locationService.getLocationByCode(locationCode);
//        return ResponseEntity.ok(response);
//    }
}
