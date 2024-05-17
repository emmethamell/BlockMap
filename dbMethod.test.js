// Test that BUILDING CODE DIDNT MATCH error message shown with invalid building id (getBuilding)
test("getRoom returns error message with invalid building id", async ()=>{
    try {
        const response = await fetch("https://blockmap.onrender.com/room?roomId=MAX-108");
        const data = await response.json();
     //   console.log(data)
        expect(data).toHaveProperty('ERROR');
        expect(data.ERROR).toBe("BUILDING CODE DIDN'T MATCH");
    } catch (error) {
        //Handle errors that occur during fetching or processing response
        console.error('Fetching failed:', error);
    }
})

// Test that error NO ROOM FOUND message shown with invalid room id (getRoom)
test("getRoom returns error message with invalid room id", async ()=>{
    try {
        const response = await fetch("https://blockmap.onrender.com/room?roomId=MAH-222");
        const data = await response.json();
       expect(data).toHaveProperty('ERROR');
       expect(data.ERROR).toBe("NO ROOM FOUND");
    } catch (error) {
        //Handle errors that occur during fetching or processing response
        console.error('Fetching failed:', error);
    }
})

//test get rooms returns correct information
test("getRoom returns error message with invalid room id", async ()=>{
    try {
        const response = await fetch("https://blockmap.onrender.com/room?roomId=DKSN-214");
        const data = await response.json();
        expect(data).toHaveProperty('building_code');
        expect(data.building_code).toBe("DKSN");
        expect(data).toHaveProperty('room_code');
        expect(data.room_code).toBe("214");
    } catch (error) {
        // Handle errors that occur during fetching or processing response
        console.error('Fetching failed:', error);
    }
})


//Test error message shown when invalid building query (getBuilding)
test("building returns error message with invalid room id", async ()=>{
    try {
        const response = await fetch("https://blockmap.onrender.com/buildings");
        const data = await response.json(); 
        for(let i = 0; i < data.length; ++i){
            expect(data[i]).toHaveProperty("buildingCode")
        }
    } catch (error) {
        // Handle errors that occur during fetching or processing response
        console.error('Fetching failed:', error)
    }
})

//test that correct information is returned 
test("building returns correct building information", async ()=>{
    try {
        console
        const response = await fetch("https://blockmap.onrender.com/room?roomId=SOM-106");
        const data = await response.json();
        expect(data).toHaveProperty('building_code');
        expect(data.building_code).toBe("SOM");
        expect(data).toHaveProperty('room_code')
        expect(data.room_code).toBe("106");
    } catch (error) {
        console.error(error)
    }
})


