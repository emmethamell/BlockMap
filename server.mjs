import express from "express";
import dotenv from 'dotenv'
import cors from 'cors';

import { getBuildings, getRoom, getRooms } from './database.mjs'
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config()
const app = express();
const port = 3000;
const uri = process.env.URI;

app.use(express.json());
app.use(cors()); 

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
/**
 * @GET /BlockMap
 * @description Get buildings from BlockMap database based on building code query parameter
 * No queries, returns all building information
 */
app.get('/buildings', async(req, res) => {
  try {
    const buildings = await getBuildings(client)
    res.json(buildings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
});

/**
 * @POST /BlockMap
 * @description Batch get rooms from the BlockMap database based on query parameters
 * @query {string} roomIds - the group of rooms to get, formatted as building-room
 */
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

/**
 * @GET /BlockMap
 * @description get singular from the BlockMap database based on query parameters
 * @query {string} roomId - the rooms to get, formatted as building-room
 */
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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

