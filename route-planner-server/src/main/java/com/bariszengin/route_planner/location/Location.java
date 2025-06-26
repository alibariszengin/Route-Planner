package com.bariszengin.route_planner.location;

import com.bariszengin.route_planner.transportation.Transportation;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "location")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"originTransportations", "destinationTransportations"})
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 100, message = "Name must be less than 100 characters")
    @Column(name = "name", length = 100)
    @NotBlank(message = "Name is required")
    private String name;

    @Size(max = 50, message = "City must be less than 50 characters")
    @Column(name = "city", length = 50)
    private String city;

    @Size(max = 50, message = "Country must be less than 50 characters")
    @Column(name = "country", length = 50)
    private String country;

    @NotNull(message = "Location code required")
    @Size(max = 10, message = "Location code must be less than 10 characters")
    @Column(name = "code", length = 10, unique = true)
    private String code;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "originLocation", cascade = CascadeType.REMOVE)
    private List<Transportation> originTransportations;

    @OneToMany(mappedBy = "destinationLocation", cascade = CascadeType.REMOVE)
    private List<Transportation> destinationTransportations;

    public Location(String name, String city, String country, String code) {
        this.name = name;
        this.city = city;
        this.country = country;
        this.code = code;
    }
}
