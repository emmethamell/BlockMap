import dotenv from "dotenv";
import XLSX from "xlsx";
import { MongoClient, ServerApiVersion } from "mongodb";
import { convertTime } from "./helpers.mjs";

dotenv.config({ path: "../.env" });
const uri = process.env.URI;



function addData() {

    const newClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

    function getData() {
        const workbook = XLSX.readFile("./Spring_2024_Class_Schedule.xlsx");
        const sheetName = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[sheetName];
      
        return XLSX.utils.sheet_to_json(worksheet);
      }
      
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
      
      let data = getData();
      
      // Filtering out exam times as we arent including dates in blocks. We should probably add them in somehow later though
      data = data.filter((item) => !item.Course.startsWith("EXAM"));
      
      const buildings = {};
      data.forEach((item) => {
        const [buildingCode, roomCode] = item.Location.split(/(\d+)/g).slice(0, 2);
        const roomKey = `${buildingCode}_${roomCode}`;
      
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
      });
      
      newClient
        .connect()
        .then(async () => {
          console.log("connection to mongodb successful (NEW)");
      
          const collection = newClient.db("blockmap").collection("buildings");
      
          await collection.insertMany(Object.values(buildings));
      
          return newClient.close();
        })
        .catch((err) => console.error(err));

}


function addBuildingBlocks() {

    const newClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });


      newClient
      .connect()
      .then(async () => {
        console.log("connection to mongodb successful (NEW)");
    
        const collection = newClient.db("blockmap").collection("buildings");
    
        await collection.updateMany({}, {
          $set: {
            "blocks.Mon": [[700, 2200]],
            "blocks.Tue": [[700, 2200]],
            "blocks.Wed": [[700, 2200]],
            "blocks.Thu": [[700, 2200]],
            "blocks.Fri": [[700, 1900]],
            "blocks.Sat": [[1200, 2200]],
            "blocks.Sun": [[1600, 2200]]
          }
        });
    
        return newClient.close();
      })
      .catch((err) => console.error(err));

}

async function sort() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

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

async function removeDuplicates() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();

    const buildings = client.db("blockmap").collection("buildings");
    const cursor = buildings.find();

    while (await cursor.hasNext()) {
      const building = await cursor.next();
      for (let room of building.rooms) {
        for (let day of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']) {
          if (room.blocks[day]) {
            const uniqueBlocks = Array.from(new Set(room.blocks[day].map(JSON.stringify)), JSON.parse);
            room.blocks[day] = uniqueBlocks;
          }
        }
      }
     await buildings.updateOne({ _id: building._id }, { $set: { rooms: building.rooms } });
    }
  } finally {
    await client.close();
  }
}

async function deleteAll() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

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
