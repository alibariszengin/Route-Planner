package com.bariszengin.route_planner.transportation;

import com.bariszengin.route_planner.location.Location;
import com.bariszengin.route_planner.type.TransportationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transportation",
        uniqueConstraints = @UniqueConstraint(
                name = "u_transportation_unique",
                columnNames = {"origin_location_id", "destination_location_id", "type"}
        ))
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"originLocation", "destinationLocation"}) // Lazy loading issues önlemek için
public class Transportation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Transportation type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 30)
    private TransportationType type;

    @NotNull(message = "Origin location is required")
    @Column(name = "origin_location_id")
    private Long originLocationId;

    @NotNull(message = "Destination location is required")
    @Column(name = "destination_location_id")
    private Long destinationLocationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_location_id", insertable = false, updatable = false)
    private Location originLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_location_id", insertable = false, updatable = false)
    private Location destinationLocation;

    @Column(name = "working_days")
    private String workingDays;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Custom constructor without id and timestamps
    public Transportation(Location originLocation, Location destinationLocation, TransportationType type) {
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.type = type;
    }
}