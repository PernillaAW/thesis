db.createCollection("optimized", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [id],
            propeties: {
                id: {
                    bsonType: "int"
                },
                severity:  {
                    bsonType: "int"
                },
                windy: {
                    bsonType: "int"
                },
            }
        }
    }
})

//Remember to add descition to unoptimized calls.
db.optimized.createIndex({id: 1})