CREATE TABLE IF NOT EXISTS location (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50),
    country VARCHAR(50),
    code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transportation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    origin_location_id BIGINT NOT NULL,
    destination_location_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('FLIGHT', 'BUS', 'SUBWAY', 'UBER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_transportation_origin_location
        FOREIGN KEY (origin_location_id) REFERENCES location(id),
    CONSTRAINT fk_transportation_destination_location
        FOREIGN KEY (destination_location_id) REFERENCES location(id),
    CONSTRAINT c_different_locations
        CHECK (origin_location_id != destination_location_id),
    CONSTRAINT u_transportation_unique
            UNIQUE (origin_location_id, destination_location_id, type)
);


CREATE INDEX idx_location_city ON location(city);
CREATE INDEX idx_transportation_origin_location ON transportation(origin_location_id);
CREATE INDEX idx_transportation_destination_location ON transportation(destination_location_id);
CREATE INDEX idx_transportation_transport_type ON transportation(type);