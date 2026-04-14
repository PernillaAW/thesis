CREATE TABLE unoptimized(
    id SERIAL PRIMARY KEY,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Start_Lng DOUBLE PRECISION, 
    Start_Lat DOUBLE PRECISION, 
    start_time DATE, 
    End_time DATE
);

CREATE TABLE optimized(
    id SERIAL PRIMARY KEY,
    Severity INT,
    State VARCHAR(2),
    Windy SMALLINT,
    Precipitation FLOAT, 
    Start_Lng DOUBLE PRECISION, 
    Start_Lat DOUBLE PRECISION, 
    Start_time DATE, 
    End_time DATE
);
CREATE INDEX Severity_idx ON optimized(Severity);
CREATE INDEX Windy_idx ON optimized(Windy);