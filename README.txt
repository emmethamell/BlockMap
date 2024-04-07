About the Project:
StudySpace is a progressive web app (PWA) that allows UMass students and- 
faculty to locate nearby buildings and rooms to study in. 
Users can choose rooms based on images, proximity to their location, and distinct features of a given room. 

Features of StudySpace:
- Geolocation to find closest study space 
- Images of rooms
- Highlighted features specific to rooms 
- Filtering option to filter out rooms based on desired room features 

About BlockMap:
BlockMap is an integral piece to the functioning of the StudySpace application as it indicates room availability. 
BlockMap serves as a REST API that queries a MongoDB database to make building information available to client (frontend team, SpaceFace)
BlockMap parses, queries, stores, and prepares data specific to an inputted building or room. 
This data includes the hours in which a specific room(s), or buildings are unavaialble to users. 

REST API Endpoints: 
-Get /buildings: all build hours. Returns array of “Building” objects.

-Get /room:  a single room. Takes a single “room id” as a “roomId” query param. 
Returns a single “Block Map” object corresponding to the room in the URL

-Post /rooms: Batch get rooms. Request body containing an array of “room ids”  
Returns an array of “Block Map” objects for each room in the request body

Technologies:
 - Node.js 
 - Express
 - MongoDB 

