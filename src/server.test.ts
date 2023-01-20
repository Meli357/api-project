import supertest from "supertest";

import { prismaMock } from "./lib/prisma/client.mock";

import app from "./app";

const request = supertest(app);

test("GET /planets", async () => {
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

// test("test", () => {
//     expect(true).toBe(true);
// });
