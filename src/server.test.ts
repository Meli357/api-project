import supertest from "supertest";

import { prismaMock } from "./lib/prisma/client.mock";

import app from "./app";

const request = supertest(app);

describe("GET /planets", () => {
    test("Valid request", async () => {
        const planets = [
            {
                id: 1,
                name: "Mercury",
                description: null,
                diameter: 1234,
                moons: 12,
                createdAt: "2023-01-31T22:38:49.263Z",
                updatedAt: "2023-01-31T22:40:02.119Z",
            },
            {
                id: 2,
                name: "Venus",
                description: null,
                diameter: 5678,
                moons: 6,
                createdAt: "2023-01-31T22:43:42.558Z",
                updatedAt: "2023-01-31T23:06:00.856Z",
            },
        ];

        //@ts-ignore
        prismaMock.planet.findMany.mockResolvedValue(planets);

        const response = await request
            .get("/planets")
            .expect(200)
            .expect("Content-Type", /application\/json/)
            //add header, to enable our page to make http request
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.body).toEqual(planets);
    });
});

describe("POST /planets", () => {
    test("Valid request", async () => {
        const planet = {
            id: 3,
            name: "Mercury",
            description: null,
            diameter: 1234,
            moons: 12,
            createdAt: "2023-01-31T22:54:15.614Z",
            updatedAt: "2023-01-31T23:03:26.383Z",
        };

        //@ts-ignore
        prismaMock.planet.create.mockResolvedValue(planet);

        const response = await request
            .post("/planets")
            .send({
                name: "Mercury",
                diameter: 1234,
                moons: 12,
            })
            .expect(201)
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.body).toEqual(planet);
    });

    test("Invalid request", async () => {
        const planet = {
            diameter: 1234,
            moons: 12,
        };

        const response = await request
            .post("/planets")
            .send(planet)
            .expect(422)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });
});

//to get a single planet
describe("GET /planets/:id", () => {
    test("Valid request", async () => {
        const planet = {
            id: 1,
            name: "Mercury",
            description: null,
            diameter: 1234,
            moons: 12,
            createdAt: "2023-01-31T22:38:49.263Z",
            updatedAt: "2023-01-31T22:40:02.119Z",
        };

        //@ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(planet);

        const response = await request
            .get("/planets/1")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planet);
    });

    //to handle inexistent id
    test("Planet does not exist", async () => {
        //@ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(null);

        const response = await request
            .get("/planets/23")
            //not found error response
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/23");
    });

    //to handle invalid id
    test("Invalid planet Id", async () => {
        const response = await request
            .get("/planets/abcd")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/abcd");
    });
});

//to update a planet
describe("PUT /planets/:id", () => {
    test("Valid request", async () => {
        const planet = {
            id: 3,
            name: "Mercury",
            description: "Rocky planet",
            diameter: 1234,
            moons: 12,
            createdAt: "2023-01-31T22:54:15.614Z",
            updatedAt: "2023-01-31T23:03:26.383Z",
        };

        //@ts-ignore
        prismaMock.planet.update.mockResolvedValue(planet);

        const response = await request
            .put("/planets/3")
            .send({
                name: "Mercury",
                description: "Rocky planet",
                diameter: 1234,
                moons: 12,
            })
            //status code OK response
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.body).toEqual(planet);
    });

    test("Invalid request", async () => {
        const planet = {
            diameter: 1234,
            moons: 12,
        };

        const response = await request
            .put("/planets/23")
            .send(planet)
            .expect(422)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });

    test("Planet does not exist", async () => {
        //@ts-ignore
        prismaMock.planet.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .put("/planets/23")
            .send({
                name: "Mercury",
                description: "Rocky planet",
                diameter: 1234,
                moons: 12,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/23");
    });

    test("Invalid planet Id", async () => {
        const response = await request
            .put("/planets/abcd")
            .send({
                name: "Mercury",
                description: "Rocky planet",
                diameter: 1234,
                moons: 12,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/abcd");
    });
});

//to delete a planet
describe("DELETE /planets/:id", () => {
    test("Valid request", async () => {
        const response = await request
            .delete("/planets/1")
            //status code No content
            .expect(204)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.text).toEqual("");
    });

    test("Planet does not exist", async () => {
        //@ts-ignore
        prismaMock.planet.delete.mockRejectedValue(new Error("Error"));

        const response = await request
            .delete("/planets/23")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /planets/23");
    });

    test("Invalid planet Id", async () => {
        const response = await request
            .delete("/planets/abcd")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /planets/abcd");
    });
});

/* These tests depend on: src/lib/middleware/multer.mock.ts
It uses multer.memoryStorage, so no files are writtten to disk */

//new route that connects file uploads
describe("POST /planets/:id/photo", () => {
    test("Valid request with PNG file upload", async () => {
        await request
            .post("/planets/23/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(201)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
    });

    test("Planet does not exist", async () => {
        // @ts-ignore
        prismaMock.planet.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .post("/planets/23/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /planets/23/photo");
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .post("/planets/abcd/photo")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /planets/abcd/photo");
    });

    test("Invalid request with no file upload", async () => {
        const response = await request
            .post("/planets/23/photo")
            //client error
            .expect(400)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("No photo file uploaded");
    });
});
