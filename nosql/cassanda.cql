CREATE TABLE unoptimized(
    id uuid,
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
    id uuid,
    severity INT,
    us_state VARCHAR(2),
    precipitation FLOAT, 
    windy SMALLINT, 
    longitude LONG, 
    latitude LONG, 
    start_time DATE, 
    end_time DATE,
    PRIMARY KEY(id)
)