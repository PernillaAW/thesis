import cassandra from 'cassandra-driver';
import dotenv from 'dotenv';

dotenv.config();

export async function cassandraConnect() {
   
        const userInfo = new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USER, process.env.CASSANDRA_PASSWORD);
        const contactPoints = [process.env.CASSANDRA_DATABASE_POINT];
        const dataCenter = 'datacenter1';
        const connect = new cassandra.Client({contactPoints: contactPoints, authProvider: userInfo, localDataCenter: dataCenter, keyspace: 'thesis'});
        try{
        await connect.connect()
        console.log("Cassandra connected") 
        return connect
    }catch(e){
        console.error("error with cassandra", e)
    }

}
