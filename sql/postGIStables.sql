CREATE TABLE IF NOT EXISTS unoptimized(
    id SERIAL PRIMARY KEY,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Geo geometry(POINT, 4326),
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
    End_time DATE,
    Geo_text VARCHAR(200)
);

CREATE INDEX Severity_idx ON optimized(Severity);