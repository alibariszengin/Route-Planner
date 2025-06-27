package com.bariszengin.route_planner.core.graph;

import com.bariszengin.route_planner.location.dto.LocationResponseDTO;
import com.bariszengin.route_planner.transportation.dto.RouteResponseDTO;
import com.bariszengin.route_planner.transportation.dto.TransportationResponseDTO;
import com.bariszengin.route_planner.type.TransportationType;

import java.util.*;

public class RouteFinder {
    private final int MAX_TRANSPORTATION_NUMBER = 3;
    private final int ALLOWED_TRANSPORTATION_AFTER_FLIGHT = 1;
    private final int ALLOWED_TRANSPORTATION_BEFORE_FLIGHT = 1;

    public List<RouteResponseDTO> findAllRoutes(LocationResponseDTO origin, LocationResponseDTO destination, List<TransportationResponseDTO> transportations) {
        Map<Long, List<TransportationResponseDTO>> graph = buildGraph(transportations);

        LinkedList<TransportationResponseDTO> path = new LinkedList<>();
        List<RouteResponseDTO> results = new LinkedList<>();
        RoutePath routePath = new RoutePath(path);
        dfs(origin, destination, graph, routePath, new HashSet<>(), results);

        return results;
    }

    private void dfs(
            LocationResponseDTO current,
            LocationResponseDTO target,
            Map<Long, List<TransportationResponseDTO>> graph,
            RoutePath routePath,
            Set<LocationResponseDTO> visited,
            List<RouteResponseDTO> results
    ) {
        List<TransportationResponseDTO> path = routePath.getPath();

        if (!validatePath(path, routePath)){
            return;
        }

        if (current.equals(target) && routePath.hasFlight) {
            RouteResponseDTO route = new RouteResponseDTO(new ArrayList<>(path));
            results.add(route); // Reached the destination/target
            return;
        }

        visited.add(current); // Add visited list.

        //Get transportations that origins of them are the current location
        List<TransportationResponseDTO> transportations = graph.getOrDefault(current.getId(), Collections.emptyList());

        for (TransportationResponseDTO t : transportations) {
            if (!visited.contains(t.getDestinationLocation()) // If destination of transportation not visited continue on that. AND
                    && !(routePath.hasFlight && t.getType().equals(TransportationType.FLIGHT))) { // If there is no FLIGHT already

                path.add(t);
                if (t.getType().equals(TransportationType.FLIGHT)) {
                    routePath.setHasFlight(true);
                    routePath.setFlightIndex(path.size());
                }

                dfs(t.getDestinationLocation(), target, graph, routePath, visited, results);

                if (t.getType().equals(TransportationType.FLIGHT)) { // If it was FLIGHT then make hasFlight false
                    routePath.setHasFlight(false);
                    routePath.setFlightIndex(0);
                }
                path.removeLast();
            }
        }

        visited.remove(current);
    }

    private boolean validatePath(List<TransportationResponseDTO> path, RoutePath routePath) {
        if (path.size() > MAX_TRANSPORTATION_NUMBER) {
            return false; // STOP IT! if more than three transportation.
        }
        if (routePath.hasFlight && path.size() - routePath.flightIndex > ALLOWED_TRANSPORTATION_AFTER_FLIGHT) {
            return false; // STOP IT! if there is flight and more than allowed transportations after it
        }
        if (!routePath.hasFlight && path.size() > ALLOWED_TRANSPORTATION_BEFORE_FLIGHT) {
            return false; // STOP IT! if there is no flight and more than allowed transportations before any flight
        }
        return true;
    }
    private Map<Long, List<TransportationResponseDTO>> buildGraph(List<TransportationResponseDTO> transportations) {
        Map<Long, List<TransportationResponseDTO>> graph = new HashMap<>();
        for(TransportationResponseDTO transportation: transportations) {
            Long location = transportation.getOriginLocation().getId();
            List<TransportationResponseDTO> locationTransportations = graph.getOrDefault(location, new LinkedList<>());
            locationTransportations.add(transportation);
            graph.put(location, locationTransportations);
        }
        return graph;
    }
}
