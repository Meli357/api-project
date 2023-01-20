import express from "express";
import "express-async-errors";

import prisma from "./lib/prisma/client";

const app = express();

app.get("/planets", async (request, response) => {
    const planets = await prisma.planet.findMany();

    response.json(planets);
});

export default app;

/*
Response on POSTMAN:

[
    {
        "id": 1,
        "name": "Mercury",
        "description": null,
        "diameter": 1234,
        "moons": 12,
        "createdAt": "2023-01-19T23:40:32.446Z",
        "updatedAt": "2023-01-19T23:24:25.946Z"
    },
    {
        "id": 2,
        "name": "Venus",
        "description": null,
        "diameter": 5678,
        "moons": 6,
        "createdAt": "2023-01-19T23:40:32.446Z",
        "updatedAt": "2023-01-19T23:25:01.831Z"
    }
]
 */

/*
GET /planets -> Retrieve all planets
app.get("/planets", (request, response)=>{});

GET /planets/:id -> Retrieve a specific planet
app.get("/planets/:id", (request, response)=>{});

POST /planets -> Create a new planet
app.post("/planets", (request, response)=>{});

PUT /planets/:id -> Replace an existing planet
app.put("/planets/:id", (request, response)=>{});

DELETE /planets -> Delete a planet
app.delete("/planets/:id", (request, response)=>{});

POST /planets/:id/photo -> Add a photo for a planet
app.post("/planets/:id/photo", (request, response)=>{});
*/
