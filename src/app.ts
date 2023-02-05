import express from "express";
import "express-async-errors";

import { validationErrorMiddleware } from "./lib/middleware/validation";
import { initCorsMiddleware } from "./lib/middleware/cors";

import planetsRoutes from "./routes/planets";

const app = express();

app.use(express.json());

app.use(initCorsMiddleware());

app.use("/planets", planetsRoutes);

//after the routes
app.use(validationErrorMiddleware);

export default app;

/*
GET /planets -> Retrieve all planets
app.get("/planets", (request, response)=>{});

GET /planets/:id -> Retrieve a specific planet
app.get("/planets/:id", (request, response)=>{});

POST /planets -> Create a new planet
app.post("/planets", (request, response)=>{});

PUT /planets/:id -> Replace an existing planet
app.put("/planets/:id"+, (request, response)=>{});

DELETE /planets -> Delete a planet
app.delete("/planets/:id", (request, response)=>{});

POST /planets/:id/photo -> Add a photo for a planet
app.post("/planets/:id/photo", (request, response)=>{});
*/
