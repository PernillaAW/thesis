
db.createCollection("optimized", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["id"],
            properties: {
                id: {
                    bsonType: "int"
                },
                severity:  {
                    bsonType: "int"
                },
                windy: {
                    bsonType: "int"
                },
                us_state:{
                    bsonType: "string"
                },
                precipitation: {
                    bsonType: "double"
                }, 
                longitude: {
                    bsonType:"double"
                    }, 
                latitude:{
                    bsonType:"double"
                }, 
                start_time: {
                    bsonType:"date"
                }, 
                end_time: {
                    bsonType:"date"
                }
            }
        }
    }
})

//Remember to add descition to unoptimized calls.
db.optimized.createIndex({id: 1})