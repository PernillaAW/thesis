CREATE TABLE IF NOT EXISTS unoptimized(
    id SERIAL,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Start_Lng DOUBLE PRECISION, 
    Start_Lat DOUBLE PRECISION, 
    Time DATE, 
    Date DATE
);

CREATE TABLE IF NOT EXISTS optimized_scarp(
    id SERIAL PRIMARY KEY,
    Severity INT,
    State VARCHAR(2),
    Windy SMALLINT,
    Precipitation FLOAT, 
    Start_time DATE, 
    End_time DATE,
    Geo_text VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS optimized(
    id SERIAL PRIMARY KEY,
    Severity INT,
    State VARCHAR(2),
    Windy SMALLINT,
    Precipitation FLOAT, 
    Geo geometry(POINT, 4326),
    Start_time DATE, 
    End_time DATE
);

CREATE INDEX Geo_idx ON optimized(Geo);