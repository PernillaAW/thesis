CREATE TABLE unoptimized(
    id uuid,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Start_Lng LONG, 
    Start_Lat LONG, 
    Start_time DATE, 
    End_time DATE
)

CREATE TABLE optimized(
    id uuid,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Start_Lng LONG, 
    Start_Lat LONG, 
    Start_time DATE, 
    End_time DATE,
    PRIMARY KEY(id)
)