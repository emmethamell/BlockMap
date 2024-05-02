import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { convertTime, getData } from "./helpers.mjs";

dotenv.config({ path: "../.env" });
const uri = process.env.URI;

//TODO: Filter out Location: ON-LINE

//function to connect to DB client
function connectDB() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  return client;
}
//populate the data base with building and room info 
function addData() {
  /*
      Example object in data array here:
        {
          Course: 'ACCOUNTG 221 01LL 10002 1243',
          'Reference #': '2023-ACQZQV',
          Organization: '5-ACCOUNTG',
          'Event Start Date': 45329.37847222222, 
          'Event End Date': 45420.413194444445, 
          MO: '',
          TU: '',
          WE: 'WE',
          TH: '',
          FR: '',
          SA: '',
          SU: '',
          'Event Start Time': 45329.37847222222,
          'Event End Time': 45420.413194444445,
          'Exp Head Count': 25,
          'Reg Head Count': 22,
          Location: 'SOM0120',
          'Loc Max Cap': 25
        },
      */

  const client = connectDB();

  let data = getData();

  // Filtering out exam times as we arent including dates in blocks. We should probably add them in somehow later though
  data = data.filter((item) => (!item.Course.startsWith("EXAM")));
  console.log("SIZE BEFORE: ", data.length);
  
  // Filtering out the courses that start and end on the same day
  data = data.filter((item) => {
    const startDate = Math.floor(item["Event Start Time"]);
    const endDate = Math.floor(item["Event End Time"]);
    
    return startDate !== endDate;
  });
  console.log("SIZE AFTER: ", data.length);


  const buildings = {};
  data.forEach((item) => {
    const [buildingCode, roomCode] = item.Location.split(/(\d+)/g).slice(0, 2);
    const roomKey = `${buildingCode}_${roomCode}`;

    if (buildingCode !== "" && buildingCode !== "ON-LINE") {

    if (!buildings[buildingCode]) {
      buildings[buildingCode] = {
        buildingCode: buildingCode,
        blocks: {
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
          Sun: [],
        },
        rooms: [],
      };
    }

    if (
      !buildings[buildingCode].rooms.find((room) => room.roomCode === roomKey)
    ) {
      buildings[buildingCode].rooms.push({
        roomCode: roomKey,
        blocks: {
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
          Sun: [],
        },
      });
    }

    const room = buildings[buildingCode].rooms.find(
      (room) => room.roomCode === roomKey
    );
    if (item.MO)
      room.blocks["Mon"].push([
        convertTime(item["Event Start Time"]),
        convertTime(item["Event End Time"]),
      ]);
    if (item.TU)
      room.blocks["Tue"].push([
        convertTime(item["Event Start Time"]),
        convertTime(item["Event End Time"]),
      ]);
    if (item.WE)
      room.blocks["Wed"].push([
        convertTime(item["Event Start Time"]),
        convertTime(item["Event End Time"]),
      ]);
    if (item.TH)
      room.blocks["Thu"].push([
        convertTime(item["Event Start Time"]),
        convertTime(item["Event End Time"]),
      ]);
    if (item.FR)
      room.blocks["Fri"].push([
        convertTime(item["Event Start Time"]),
        convertTime(item["Event End Time"]),
      ]);
    if (item.SA)
      room.blocks["Sat"].push([
        convertTime(item["Event Start Time"]),
        convertTime(item["Event End Time"]),
      ]);
    if (item.SU)
      room.blocks["Sun"].push([
        convertTime(item["Event Start Time"]),
        convertTime(item["Event End Time"]),
      ]);
    }

  });

  client
    .connect()
    .then(async () => {
      console.log("connection to mongodb successful (NEW)");

      const collection = client.db("blockmap").collection("buildings");

      await collection.insertMany(Object.values(buildings));

      return client.close();
    })
    .catch((err) => console.error(err));
}
//add building block hour times in DB
function addBuildingBlocks() {
  const client = connectDB();

  client
    .connect()
    .then(async () => {
      console.log("connection to mongodb successful (NEW)");

      const collection = client.db("blockmap").collection("buildings");

      await collection.updateMany(
        {},
        {
          $set: {
            "blocks.Mon": [[700, 2200]],
            "blocks.Tue": [[700, 2200]],
            "blocks.Wed": [[700, 2200]],
            "blocks.Thu": [[700, 2200]],
            "blocks.Fri": [[700, 1900]],
            "blocks.Sat": [[1200, 2200]],
            "blocks.Sun": [[1600, 2200]],
          },
        }
      );

      return client.close();
    })
    .catch((err) => console.error(err));
}
//sorts the times of classes in ascending order in DB
async function sort() {
  const client = connectDB();

  try {
    await client.connect();

    const buildings = client.db("blockmap").collection("buildings");
    const cursor = buildings.find();

    while (await cursor.hasNext()) {
      const building = await cursor.next();
      for (let room of building.rooms) {
        for (let day of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]) {
          if (room.blocks[day]) {
            room.blocks[day] = Array.from(
              new Set(room.blocks[day].sort((a, b) => a[0] - b[0]))
            );
          }
        }
      }
      await buildings.updateOne(
        { _id: building._id },
        { $set: { rooms: building.rooms } }
      );
    }
  } finally {
    await client.close();
  }
}
//removes duplicate times in the DB
async function removeDuplicates() {

  const client = connectDB();

  try {
    await client.connect();

    const buildings = client.db("blockmap").collection("buildings");
    const cursor = buildings.find();

    while (await cursor.hasNext()) {
      const building = await cursor.next();
      for (let room of building.rooms) {
        for (let day of ["Mon", "Tue", "Wed", "Thu", "Fri"]) {
          if (room.blocks[day]) {
            const uniqueBlocks = Array.from(
              new Set(room.blocks[day].map(JSON.stringify)),
              JSON.parse
            );
            room.blocks[day] = uniqueBlocks;
          }
        }
      }
      await buildings.updateOne(
        { _id: building._id },
        { $set: { rooms: building.rooms } }
      );
    }
  } finally {
    await client.close();
  }
}


//deletes all entries in database in case needing to repopulate
async function deleteAll() {
  const client = connectDB();

  try {
    await client.connect();
    const collection = client.db("blockmap").collection("buildings");
    await collection.deleteMany({}, function (err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log("All documents deleted");
      }
    });
  } finally {
    await client.close();
  }
}
//gets desired building codes from excel sheet
function getBuildingCodes() {
  let data = getData();
  data = data.filter((item) => !item.Course.startsWith("EXAM"));

  let buildingCodes = []
  data.forEach((item) => {
    const buildingCode = item.Location.split(/(\d+)/g)[0];
    if (!buildingCodes.includes(buildingCode)) {
      buildingCodes.push(buildingCode)
    } 
  });

  buildingCodes = buildingCodes.filter((code) => {
    return (code && code !== "" && code !== "ON-LINE")
  })

  return buildingCodes
}





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


