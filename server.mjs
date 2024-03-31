import express from "express";

const app = express();
const port = 3000;

app.get('/buildings', (req, res) => {
  //example data
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

    //get data for each room, create and return an array of blockmap objects
  
    res.json([{}, {}, {}]);
});

app.get('/room', (req, res) => {
    const roomId = req.query.roomId;

    //get data for room given id and return blockmap obj for room

    res.json({roomId: roomId})

})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});