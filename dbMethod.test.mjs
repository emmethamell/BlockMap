import assert from "node:assert";

// Test that error message shown with invalid room id (getRoom)
test("getRoom returns error message with invalid room id", ()=>{
    fetch("https://blockmap.onrender.com/oom?roomId=HERT_0207").then(data=> console.log(data));
})

// Test that error message shown with invalid room id (getRoom)


//Test error message shown when invalid building query (getBuilding)

//Test error message that one or all rooms invalid (getRooms)


