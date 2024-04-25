# BlockMap

BlockMap is an integral piece to the functioning of the StudySpace application as it indicates room availability. BlockMap serves as a REST API that queries a MongoDB database to make building information available to client (frontend team, [SpaceFace](https://github.com/NickW777/SpaceFace)). BlockMap parses, queries, stores, and prepares data specific to an inputted building or room. This data includes the hours in which a specific room(s), or buildings are unavailable to users.

### BlockMap uses the following technologies:
- Node.js/Express.js for server/routing
- MongoDB for storing collected data on study space availability

### Current public API route(s):
- `GET /buildings` - all building hours. Returns array of “Building” objects.
- `GET /room` -  a single room. Takes a single “room id” as a “roomId” query parameter. Returns a single “BlockMap” object corresponding to the room in the URL.
- `POST /rooms` - Batch get rooms. Request body containing an array of “room ids”. Returns an array of “BlockMap” objects for each room in the request body.

## About StudySpace:
StudySpace is a progressive web app (PWA) that allows UMass students and faculty to locate nearby buildings and rooms to study in. Users can choose rooms based on images, proximity to their location, and distinct features of a given room. 

## Explore StudySpace's other components:
### [SpaceFace](https://github.com/NickW777/SpaceFace)
The "face" of StudySpace; serves as the frontend/client.
### [SpaceProvider](https://github.com/Yonava/SpaceProvider)
The other of the two backend components of StudySpace. Serves the frontend characteristic data about rooms via a REST API.
