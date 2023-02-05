//define a type for Express.user
declare global {
    namespace Express {
        interface User {
            username: string;
        }
    }
}

export {};
