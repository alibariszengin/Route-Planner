INSERT INTO location (name, city, country, code)
VALUES ('Heathrow Airport', 'London', 'United Kingdom', 'LON001'),
       ('Times Square', 'New York', 'United States', 'NYC001'),
       ('Eiffel Tower', 'Paris', 'France', 'PAR001'),
       ('Shibuya Crossing', 'Tokyo', 'Japan', 'TYO001'),
       ('Alexanderplatz', 'Berlin', 'Germany', 'BER001'),
       ('La Rambla', 'Barcelona', 'Spain', 'BCN001'),
       ('Sydney Opera House', 'Sydney', 'Australia', 'SYD001'),
       ('Colosseum', 'Rome', 'Italy', 'ROM001'),
       ('Burj Khalifa', 'Dubai', 'UAE', 'DXB001'),
       ('Marina Bay Sands', 'Singapore', 'Singapore', 'SIN001');
INSERT INTO location (name, city, country, code)
VALUES ('Taksim Square', 'Istanbul', 'Turkey', 'IST001'),
       ('Grand Bazaar', 'Istanbul', 'Turkey', 'IST002'),
       ('Galata Tower', 'Istanbul', 'Turkey', 'IST003'),
       ('Blue Mosque', 'Istanbul', 'Turkey', 'IST004');
-- İstanbul içi örnekleri
INSERT INTO transportation (origin_location_id, destination_location_id, type, working_days)
VALUES
    (11, 12, 'BUS', '1,2,3,4,5'),
    (13, 14, 'SUBWAY', '1,2,3,4,5,6'),
    (11, 13, 'UBER', '1,2,3,4,5,6,7'),
    (12, 13, 'FLIGHT', '5'); -- sadece Cuma

-- ✅ CASE 1: GEÇERLİ — FLIGHT + 1 sonrası (1 → 2 → 3)
INSERT INTO transportation (origin_location_id, destination_location_id, type, working_days)
VALUES
    (1, 2, 'FLIGHT', '1,2,3,4,5'),
    (2, 3, 'UBER', '1,2,3,4,5');

-- ❌ CASE 2: GEÇERSİZ — FLIGHT sonrası 2 transportation (4 → 5 → 6 → 7)
INSERT INTO transportation (origin_location_id, destination_location_id, type, working_days)
VALUES
    (4, 5, 'FLIGHT', '1,2,3,4,5'),
    (5, 6, 'BUS', '1,2,3,4,5'),
    (6, 7, 'SUBWAY', '1,2,3,4,5');

-- ❌ CASE 3: GEÇERSİZ — 2 FLIGHT (8 → 9 → 10)
INSERT INTO transportation (origin_location_id, destination_location_id, type, working_days)
VALUES
    (8, 9, 'FLIGHT', '1,2,3'),
    (9, 10, 'FLIGHT', '1,2,3');

--  ❌ CASE 4: GEÇERSİZ — FLIGHT yok, tek transportation (3 → 4)
INSERT INTO transportation (origin_location_id, destination_location_id, type, working_days)
VALUES
    (3, 4, 'SUBWAY', '1,2,3,4,5,6,7');

-- ❌ CASE 5: GEÇERSİZ — FLIGHT yok, 2 transportation (2 → 5 → 8)
INSERT INTO transportation (origin_location_id, destination_location_id, type, working_days)
VALUES
    (2, 5, 'UBER', '1,2,3,4,5'),
    (5, 8, 'BUS', '1,2,3,4,5');

-- ❌ CASE 6: GEÇERSİZ — 4 transportation (1 → 6 → 5 → 4 → 9)
INSERT INTO transportation (origin_location_id, destination_location_id, type, working_days)
VALUES
    (1, 6, 'SUBWAY', '1,2,3,4,5'),
    (6, 5, 'BUS', '1,2,3,4,5'),
    (5, 4, 'UBER', '1,2,3,4,5'),
    (4, 9, 'SUBWAY', '1,2,3,4,5');

-- ✅ CASE 7: GEÇERLİ — FLIGHT tek başına (7 → 10)
INSERT INTO transportation (origin_location_id, destination_location_id, type, working_days)
VALUES
    (7, 10, 'FLIGHT', '1,2,3,4,5,6,7');

-- ❌ CASE 8 (revize): GEÇERSİZ — NORMALDE GEÇERLİ AMA GÜN NEDENİYLE GEÇERSİZ
-- Route: 10 → 9 → 8 (tek yön, FLIGHT + UBER)
-- Ama sadece Pazar günü çalışıyor, Salı günü çağrılırsa çıkmaz.

INSERT INTO transportation (origin_location_id, destination_location_id, type, working_days)
VALUES
    (10, 9, 'FLIGHT', '7'),  -- Marina Bay Sands → Burj Khalifa (sadece Pazar)
    (9, 8, 'UBER', '7');     -- Burj Khalifa → Colosseum (sadece Pazar)
/*INSERT INTO transportation (origin_location_id, destination_location_id, type)
VALUES (11, 12, 'BUS'),
       (13, 14, 'SUBWAY'),
       (11, 13, 'UBER'),
       (12, 13, 'FLIGHT');


-- ✅ CASE 1: GEÇERLİ — FLIGHT + 1 sonrası
INSERT INTO transportation (origin_location_id, destination_location_id, type)
VALUES (1, 2, 'FLIGHT'), -- London → New York
       (2, 3, 'UBER');
-- New York → Paris

-- ❌ CASE 2: GEÇERSİZ — FLIGHT sonrası 2 transportation
INSERT INTO transportation (origin_location_id, destination_location_id, type)
VALUES (4, 5, 'FLIGHT'), -- Tokyo → Berlin
       (5, 6, 'BUS'),   -- Berlin → Barcelona
       (6, 7, 'SUBWAY');
-- Barcelona → Sydney

-- ❌ CASE 3: GEÇERSİZ — 2 FLIGHT (aynı origin-destination yok!)
INSERT INTO transportation (origin_location_id, destination_location_id, type)
VALUES (8, 9, 'FLIGHT'), -- Rome → Dubai
       (9, 10, 'FLIGHT');
-- Dubai → Singapore

-- ❌ CASE 4: GEÇERLİ — FLIGHT yok, tek transportation
INSERT INTO transportation (origin_location_id, destination_location_id, type)
VALUES (3, 4, 'SUBWAY');
-- Paris → Tokyo

-- ❌ CASE 5: GEÇERSİZ — FLIGHT yok, 2 transportation
INSERT INTO transportation (origin_location_id, destination_location_id, type)
VALUES (2, 5, 'UBER'), -- New York → Berlin
       (5, 8, 'BUS');
-- Berlin → Rome

-- ❌ CASE 6: GEÇERSİZ — 4 transportation (limit aşımı)
INSERT INTO transportation (origin_location_id, destination_location_id, type)
VALUES (1, 6, 'SUBWAY'), -- London → Barcelona
       (6, 5, 'BUS'),   -- Barcelona → Berlin
       (5, 4, 'UBER'),   -- Berlin → Tokyo
       (4, 9, 'SUBWAY');
-- Tokyo → Dubai

-- ✅ CASE 7: GEÇERLİ — FLIGHT tek başına, sonrası yok
INSERT INTO transportation (origin_location_id, destination_location_id, type)
VALUES (7, 10, 'FLIGHT'); -- Sydney → Singapore*/