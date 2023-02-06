import express, { Router } from "express";

import prisma from "../lib/prisma/client";

import {
    validate,
    planetSchema,
    PlanetData,
} from "../lib/middleware/validation";

import { checkAuthorization } from "../lib/middleware/passport";

import { initMulterMiddleware } from "../lib/middleware/multer";

const upload = initMulterMiddleware();

const router = Router();

router.get("/", async (request, response) => {
    const planets = await prisma.planet.findMany();

    response.json(planets);
});

//create new route to get a single planet
//it will run only 1 or more digits
router.get("/:id(\\d+)", async (request, response, next) => {
    //to access Id parameter
    const planetId = Number(request.params.id);

    //search planet by Id using prisma client
    const planet = await prisma.planet.findUnique({
        where: { id: planetId },
    });

    //error handling/falsy check
    if (!planet) {
        response.status(404);
        return next(`Cannot GET /planets/${planetId}`);
    }

    response.json(planet);
});

router.post(
    "/",
    checkAuthorization,
    validate({ body: planetSchema }),
    async (request, response) => {
        const planetData: PlanetData = request.body;
        const username = request.user?.username as string;

        const planet = await prisma.planet.create({
            data: {
                ...planetData,
                createdBy: username,
                updatedBy: username,
            },
        });

        response.status(201).json(planet);
    }
);

//new route to update planet
router.put(
    "/:id(\\d+)",
    checkAuthorization,
    validate({ body: planetSchema }),
    async (request, response, next) => {
        const planetId = Number(request.params.id);
        const planetData: PlanetData = request.body;
        const username = request.user?.username as string;

        try {
            const planet = await prisma.planet.update({
                // where: { id: Number(request.params.id) },
                where: { id: planetId },
                data: {
                    ...planetData,
                    updatedBy: username,
                },
            });

            response.status(200).json(planet);
        } catch (error) {
            response.status(404);
            next(`Cannot PUT /planets/${planetId}`);
        }
    }
);

router.delete(
    "/:id(\\d+)",
    checkAuthorization,
    async (request, response, next) => {
        const planetId = Number(request.params.id);

        try {
            await prisma.planet.delete({
                where: { id: planetId },
            });

            response.status(204).end();
        } catch (error) {
            response.status(404);
            next(`Cannot DELETE /planets/${planetId}`);
        }
    }
);

//to upload photo
router.post(
    "/:id(\\d+)/photo",
    checkAuthorization,
    upload.single("photo"),
    async (request, response, next) => {
        console.log("request.file", request.file);

        if (!request.file) {
            response.status(400);
            return next("No photo file uploaded.");
        }

        const planetId = Number(request.params.id);
        const photoFilename = request.file.filename;

        try {
            await prisma.planet.update({
                where: { id: planetId },
                data: { photoFilename },
            });
        } catch (error) {
            response.status(404);
            next(`Cannot POST /planets/${planetId}/photo`);
        }

        // response.status(201).json({ photoFilename });
    }
);

//to view images in browser
router.use("/photos", express.static("uploads"));

export default router;
