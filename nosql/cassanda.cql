CREATE TABLE unoptimized(
    id uuid,
    severity int,
    us_state text,
    description text
)

CREATE TABLE optimized(
    id uuid,
    severity int,
    start_time date,
    end_time date,
    PRIMARY KEY(id)
)