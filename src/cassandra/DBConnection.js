import cassandra from 'cassandra-driver';
import dotenv from 'dotenv';

dotenv.config();

const userInfo = new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_DATABASE_USER, process.env.CASSANDRA_DATABASE_PASSWORD);

const contactPoints = [process.env.CASSANDRA_DATABASE_POINT];

const dataCenter = 'DataCenter';

const client = new cassandra.Client({contactPoints: contactPoints, authProvider: userInfo, localDataCenter: dataCenter});

export default client;