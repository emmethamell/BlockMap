
/*
Each building is a document in a buildings collection.
    Each building document has a buildingCode, hours, and an array of rooms.

Each room in the rooms array is an object with a roomCode and blocks
representing hours for the room


Example Document:

{
    "buildingCode": "LIB", // Building Code
    "hours": { // Blocks for the building
        "Mon": [[430, 600], [1100, 1300], [1400, 1700], [2359, 105]],
        "Tue": [[430, 600], [1100, 1300], [1400, 1700], [2359, 105]],
        // ... rest of the days
    },
    "rooms": [ // Array of rooms in the building
        {
            "roomCode": "143A", // Room Code
            "blocks": { // Blocks for the room
                "Mon": [[430, 600], [1100, 1300], [1400, 1700], [2359, 105]],
                "Tue": [[430, 600], [1100, 1300], [1400, 1700], [2359, 105]],
                // ... rest of the days
            }
        },
        // ... rest of the rooms
    ]
}
*/

//return an array of building objects for all buildings on campus
async function getBuildings(client) {
    const db = client.db('blockmap');
    const buildings = await db.collection('buildings').find({}).toArray();
    return buildings.map(x => ({buildingCode: x.buildingCode, hours: x.blocks}))
}

//roomIds is an array of room ids in the format {BUILDING_CODE}_{ROOM_CODE}
//return an array of blockmap objects for each room in roomIds
async function getRooms(client, roomIds) {

}

//roomId is in format {BUILDING_CODE}_{ROOM_CODE}
//return blockmap obj for the room
async function getRoom(client, roomId) {

}


//for testing
async function test(client) {
    const db = client.db('blockmap');
    const collection = db.collection('buildings');
    const documents = await collection.find({}).toArray();
    return documents
}


export { getBuildings, getRooms, getRoom, test }

