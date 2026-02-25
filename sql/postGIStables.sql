CREATE TABLE unoptimized(
    id SERIAL,
    severity INT,
    us_state VARCHAR(2),
    description VARCHAR(200)
)

CREATE TABLE optimized(
    id SERIAL PRIMARY KEY,
    geo_point GEOGRAPHY(Point, 4326)
)