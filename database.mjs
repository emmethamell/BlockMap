
//return an array of building objects with the hours that the building is open
async function getBuildings(client) {
    const db = client.db("blockmap");
    const buildings = await db.collection("buildings").find({}).toArray();

    if(buildings){
        return buildings.map(x => ({buildingCode: x.buildingCode, hours: x.blocks}))
    }else{
        return {"ERROR": "COULD NOT ACCESS BUILDINGS"}
    }
}

//roomIds is an array of room ids in the format {BUILDING_CODE}_{ROOM_CODE}
//return an array of blockmap objects for each room in roomIds
async function getRooms(client, roomIds) {
    const db = client.db("blockmap");
    const collection = db.collection("buildings");
    const rooms = [];

    for (let roomId of roomIds) {
        const split = roomId.split("-");
        const buildingToFind = split[0];
        const roomCode = split[1];

        const document = await collection.findOne({ buildingCode: buildingToFind, "rooms.roomCode": roomId });

        if (document) {
            let room = document.rooms.filter(room => room.roomCode === roomId);
            rooms.push({building_code: buildingToFind, room_code: roomCode, Blocks: room[0].blocks});
        }else{
            return {"ERROR": "INVALID ROOM CODE"}
        }
    }

    return rooms;
}


//roomId is in format {BUILDING_CODE}_{ROOM_CODE}
//return blockmap obj for the room
async function getRoom(client, roomId) {

    const db = client.db("blockmap");
    const split = roomId.split("-");
    const buildingToFind = split[0];
    const roomCode = split[1];
    const collection = db.collection("buildings");
    const document = await collection.findOne({buildingCode: buildingToFind, "rooms.roomCode": roomId});


    if (document) {
        const room = document.rooms.find(room => room.roomCode === roomId);
        if (room) {
            return {building_code: buildingToFind, room_code: roomCode, Blocks: room.blocks};
        } else {
            return {"ERROR": "NO ROOM FOUND"}
        }
    } else {
        return {"ERROR": "BUILDING CODE DIDN'T MATCH"}
    }
}

export { getBuildings, getRooms, getRoom }

