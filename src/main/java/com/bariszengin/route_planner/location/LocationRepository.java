package com.bariszengin.route_planner.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    Optional<Location> findByLocationCode(String locationCode);

    boolean existsByLocationCode(String locationCode);

    List<Location> findByCity(String city);

    List<Location> findByCountry(String country);

    List<Location> findByCityAndCountry(String city, String country);
}