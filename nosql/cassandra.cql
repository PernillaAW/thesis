CREATE KEYSPACE IF NOT EXISTS thesis WITH replication = {'class': 'SimpleStrategy', 'replication_factor':1};

USE thesis;

CREATE TABLE thesis.unoptimized(
    id BIGINT,
    severity INT,
    state TEXT,
    precipitation FLOAT, 
    windy SMALLINT, 
    start_Lng DOUBLE, 
    start_Lat DOUBLE, 
    date DATE, 
    time TIME,
    PRIMARY KEY(id)
);

CREATE TABLE thesis.optimizedbyid(
    id BIGINT,
    severity INT,
    state TEXT,
    precipitation FLOAT, 
    windy SMALLINT, 
    start_Lng DOUBLE, 
    start_Lat DOUBLE, 
    date DATE, 
    time TIME,
    PRIMARY KEY(id)
);

CREATE TABLE thesis.optimizedbytime(
    id BIGINT,
    severity INT,
    state TEXT,
    precipitation FLOAT, 
    windy SMALLINT, 
    start_Lng DOUBLE, 
    start_Lat DOUBLE, 
    date DATE, 
    time TIME,
    PRIMARY KEY ((date), time, id)
    ) WITH CLUSTERING ORDER BY (time DESC);

