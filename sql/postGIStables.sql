CREATE TABLE unoptimized(
    id SERIAL PRIMARY KEY,
    severity INT,
    us_state VARCHAR(2),
    precipitation FLOAT, 
    windy SMALLINT, 
    geo POINT,
    start_time DATE, 
    end_time DATE
)

CREATE TABLE optimized(
    id SERIAL PRIMARY KEY,
    severity INT,
    us_state VARCHAR(2),
    windy SMALLINT
    precipitation FLOAT, 
    geo POINT,
    start_time DATE, 
    end_time DATE
)
CREATE EXTENSION postgis;
CREATE INDEX severity_idx ON optimized(severity)