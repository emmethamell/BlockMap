import express from "express";
import dotenv from 'dotenv'

import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config()
const app = express();
const port = 3000;
const uri = process.env.URI;



const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

client.connect()
    .then(() => console.log("connection to mongodb successful"))
    .catch(err => console.error(err));

    
//close the client if the app is shut down
process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());



app.get('/buildings', (req, res) => {
  //example data
  //TODO: retrieve and return an array of all the building objects each with hours and building code
    const blocks = {
        mon: [[0, 9000], [2100, 2400]],
        tue: [[0, 9000], [2100, 2400]],
        wed: [[0, 9000], [2100, 2400]],
        thu: [[0, 9000], [2100, 2400]],
        fri: [[0, 9000], [2100, 2400]],
        sat: [[0, 2400]],
        sun: [[0, 2400]]
    }
    const buildings = [
        { buildingCode: '1', hours: blocks},
        { buildingCode: '2', hours: blocks}
    ]
    res.json(buildings);
});

app.post('/rooms', (req, res) => {
    //should be an array of room ids (building code and room numbers)
    const roomIds = req.body;

    //TODO: get data for each room, create and return an array of blockmap objects
  
    res.json([{}, {}, {}]);
});

app.get('/room', (req, res) => {
    const roomId = req.query.roomId;

    //TODO: get data for room given id and return blockmap obj for room

    res.json({roomId: roomId})

})

app.get('/test', async(req, res) => {
    const db = client.db('blockmap');
    const collection = db.collection('buildings');
    const documents = await collection.find({}).toArray();
    res.json(documents);
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});