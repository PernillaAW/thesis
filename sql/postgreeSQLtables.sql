CREATE TABLE IF NOT EXISTS unoptimized(
    id SERIAL PRIMARY KEY,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Start_Lng DOUBLE PRECISION, 
    Start_Lat DOUBLE PRECISION, 
    Time DATE, 
    Date DATE
);

CREATE TABLE IF NOT EXISTS optimized(
    id SERIAL PRIMARY KEY,
    Severity INT,
    State VARCHAR(2),
    Windy SMALLINT,
    Precipitation FLOAT, 
    Start_Lng DOUBLE PRECISION, 
    Start_Lat DOUBLE PRECISION, 
    Time DATE, 
    Date DATE
);
CREATE INDEX Severity_idx ON optimized(Severity);
CREATE INDEX Windy_idx ON optimized(Windy);