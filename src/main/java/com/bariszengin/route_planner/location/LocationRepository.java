package com.bariszengin.route_planner.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    // Location code ile arama
    Optional<Location> findByLocationCode(String locationCode);

    // Location code varlık kontrolü
    boolean existsByLocationCode(String locationCode);

    // Şehir bazında arama
    List<Location> findByCity(String city);

    // Ülke bazında arama
    List<Location> findByCountry(String country);

    // Şehir ve ülke kombinasyonu ile arama
    List<Location> findByCityAndCountry(String city, String country);
}