// Test that error message shown with invalid building id (getBuilding)
test("getRoom returns error message with invalid building id", async ()=>{
    try {
        const response = await fetch("https://blockmap.onrender.com/oom?roomId=MAX-108");
        const data = await response.json();
        expect(data).toHaveProperty('ERROR');
        expect(data.ERROR).toBe("BUILDING CODE DIDN'T MATCH");
    } catch (error) {
        // Handle errors that occur during fetching or processing response
        console.error('Fetching failed:', error);
    }
})

// Test that error message shown with invalid room id (getRoom)
test("getRoom returns error message with invalid room id", ()=>{
    
})

//Test error message shown when invalid building query (getBuilding)
test("building returns error message with invalid room id", ()=>{
    
})

//Test error message that one or all rooms invalid (getRooms)
test("getRoom returns error message with invalid building id", ()=>{
    
})

