INSERT INTO location (name, city, country, code) VALUES
('Taksim Square', 'Istanbul', 'Turkey', 'IST001'),
('Grand Bazaar', 'Istanbul', 'Turkey', 'IST002'),
('Galata Tower', 'Istanbul', 'Turkey', 'IST003'),
('Blue Mosque', 'Istanbul', 'Turkey', 'IST004');

INSERT INTO transportation (origin_location_id, destination_location_id, type) VALUES
(1, 2, 'BUS'),
(3, 4, 'SUBWAY'),
(1, 3, 'UBER'),
(2, 3, 'FLIGHT');