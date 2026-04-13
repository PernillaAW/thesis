CREATE TABLE unoptimized(
    id SERIAL PRIMARY KEY,
    severity INT,
    us_state VARCHAR(2),
    precipitation FLOAT, 
    windy SMALLINT, 
    longitude LONG, 
    latitude LONG, 
    start_time DATE, 
    end_time DATE
)

CREATE TABLE optimized(
    id SERIAL PRIMARY KEY,
    severity INT,
    us_state VARCHAR(2),
    windy SMALLINT
    precipitation FLOAT, 
    longitude LONG, 
    latitude LONG, 
    start_time DATE, 
    end_time DATE
)
CREATE INDEX severity_idx ON optimized(severity)
CREATE INDEX windy_idx ON optimized(windy)