package com.bariszengin.route_planner.transportation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransportationRepository extends JpaRepository<Transportation, Long> {

    @Query("SELECT t FROM Transportation t LEFT JOIN FETCH t.originLocation o LEFT JOIN FETCH t.destinationLocation d WHERE t.id = :id")
    Optional<Transportation> findByIdWithLocation(@Param("id") Long id);

    @Query("SELECT t FROM Transportation t LEFT JOIN FETCH t.originLocation o LEFT JOIN FETCH t.destinationLocation d")
    List<Transportation> findByAllWithLocation();

    @Query("SELECT t FROM Transportation t LEFT JOIN FETCH t.originLocation o LEFT JOIN FETCH t.destinationLocation d WHERE o.id = :originLocationId AND d.id = :destinationLocationId")
    List<Transportation> findByOriginLocationIdAndDestinationLocationId(Long originLocationId, Long destinationLocationId);

}
