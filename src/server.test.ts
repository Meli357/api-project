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
                createdAt: "2023-01-19T23:40:32.446Z",
                updatedAt: "2023-01-19T23:24:25.946Z",
            },
            {
                id: 2,
                name: "Venus",
                description: null,
                diameter: 5678,
                moons: 6,
                createdAt: "2023-01-19T23:40:32.446Z",
                updatedAt: "2023-01-19T23:25:01.831Z",
            },
        ];

        //@ts-ignore
        prismaMock.planet.findMany.mockResolvedValue(planets);

        const response = await request
            .get("/planets")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planets);
    });
});

//to group some tests together use describe block
describe("POST /planets", () => {
    test("Valid request", async () => {
        const planet = {
            name: "Mercury",
            diameter: 1234,
            moons: 12,
        };

        //add .send so it can be send as json
        const response = await request
            .post("/planets")
            .send(planet)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planet);
    });

    //name is a required field
    test("Invalid request", async () => {
        const planet = {
            diameter: 1234,
            moons: 12,
        };

        //change expect from 201 to 422 (status code)
        const response = await request
            .post("/planets")
            .send(planet)
            .expect(422)
            .expect("Content-Type", /application\/json/);

        //add object with errors property
        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });
});
