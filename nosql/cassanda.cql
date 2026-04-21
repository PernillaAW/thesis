CREATE KEYSPACE IF NOT EXISTS thesis WITH replication = {'class': 'SimpleStrategy', 'replication_factor':1};

USE thesis;

CREATE TABLE thesis.unoptimized(
    id BIGINT,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Start_Lng DOUBLE, 
    Start_Lat DOUBLE, 
    Date TEXT, 
    Time DATE,
);

CREATE TABLE thesis.optimizedbyid(
    id BIGINT,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Start_Lng DOUBLE, 
    Start_Lat DOUBLE, 
    Date TEXT, 
    Time DATE,
    PRIMARY KEY(id)
);

CREATE TABLE thesis.optimizedbytime(
    id BIGINT,
    Severity INT,
    State VARCHAR(2),
    Precipitation FLOAT, 
    Windy SMALLINT, 
    Start_Lng DOUBLE, 
    Start_Lat DOUBLE, 
    Date TEXT, 
    Time DATE,
    PRIMARY KEY((Date), Time)
)