import express from "express";
import dotenv from 'dotenv'

import { getBuildings, getRoom, getRooms, test } from './database.mjs'
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


//ENDPOINTS
app.get('/buildings', async(req, res) => {
  try {
    const buildings = await getBuildings(client)
    res.json(buildings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
});

app.post('/rooms', async(req, res) => {
    const roomIds = req.body;
    try {
      const rooms = await getRooms(client, roomIds);
      res.json(rooms)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
});

app.get('/room', async(req, res) => {
    const roomId = req.query.roomId;
    try {
      const room = await getRoom(client, roomId);
      res.json(room)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
    }
});



//for testing
app.get('/test', async(req, res) => {
  try {
    const documents = await test(client)
    res.json(documents);
  } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred' })
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

