import cors from "cors";

export function initCorsMiddleware() {
    //add options
    const corsOptions = {
        origin: "http://localhost:8080",
    };
    return cors(corsOptions);
}
