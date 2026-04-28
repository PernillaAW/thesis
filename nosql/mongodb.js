
db.createCollection("optimized", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["id"],
            properties: {
                id: {
                    bsonType: "int"
                },
                Severity:  {
                    bsonType: "int"
                },
                Windy: {
                    bsonType: "int"
                },
                State:{
                    bsonType: "string"
                },
                Precipitation: {
                    bsonType: "double"
                },
                Start_Lng: {
                    bsonType:"double"
                    }, 
                Start_Lat:{
                    bsonType:"double"
                }, 
                Start_time: {
                    bsonType:"date"
                }, 
                End_time: {
                    bsonType:"date"
                }
            }
        }
    }
})

//Remember to add descition to unoptimized calls.
db.optimized.createIndex({id: 1, Windy: 1, Severity: 1 })