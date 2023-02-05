//after install @sinclair/typebox

import { Static, Type } from "@sinclair/typebox";

//by default all fields are required
export const planetSchema = Type.Object(
    {
        name: Type.String(),
        description: Type.Optional(Type.String()),
        diameter: Type.Integer(),
        moons: Type.Integer(),
    },
    { additionalProperties: false }
);

export type PlanetData = Static<typeof planetSchema>;
