CREATE TABLE unoptimized(
    id SERIAL,
    severity INT,
    us_state VARCHAR(2),
    description VARCHAR(200)
)

CREATE TABLE optimized(
    id SERIAL PRIMARY KEY,
    severity INT,
    windy SMALLINT
)