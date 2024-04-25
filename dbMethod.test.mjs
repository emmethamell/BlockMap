import assert from "node:assert";

// Test that error message shown with invalid room id (getRoom)
test("getRoom returns error message with invalid room id", ()=>{
    fetch("https://blockmap.onrender.com/oom?roomId=HERT_0207").then(data=> console.log(data));
})

// Test that error message shown with invalid room id (getRoom)
test("getRoom returns error message with invalid building id", ()=>{
    
})

//Test error message shown when invalid building query (getBuilding)
test("building returns error message with invalid room id", ()=>{
    
})

//Test error message that one or all rooms invalid (getRooms)
test("getRoom returns error message with invalid building id", ()=>{
    
})

