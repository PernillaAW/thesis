CREATE TABLE unoptimized(
    id SERIAL,
    severity INT,
    us_state VARCHAR(2),
    description VARCHAR(200)
)

CREATE TABLE optimized(
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    severity INT,
    percipitation FLOAT,
    PRIMARY KEY(id)
)