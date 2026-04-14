CREATE TABLE unoptimized(
    id SERIAL PRIMARY KEY,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Geo POINT,
    Start_time DATE, 
    End_time DATE
)

CREATE TABLE optimized(
    id SERIAL PRIMARY KEY,
    Severity INT,
    State VARCHAR(2),
    Windy SMALLINT
    Precipitation FLOAT, 
    Geo POINT,
    Start_time DATE, 
    End_time DATE
)
CREATE EXTENSION postgis;
CREATE INDEX Severity_idx ON optimized(Severity)