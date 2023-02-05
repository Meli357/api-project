import session from "express-session";
import config from "../../config";

export function initSessionMiddleware() {
    //new session Instance with options
    return session({
        //used to encrypt session cookies
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    });
}
