import { Router } from "express";
import { passport } from "../lib/middleware/passport";

const router = Router();

//LOGIN route
router.get("/login", (request, response, next) => {
    //redirectTo to send us back
    if (
        typeof request.query.redirectTo !== "string" ||
        !request.query.redirectTo
    ) {
        response.status(400);
        return next("Missing redirectTo query string parameter");
    }

    //store redirectTo into session
    request.session.redirectTo = request.query.redirectTo;

    response.redirect("/auth/github/login");
});

router.get(
    "/auth/github/login",
    passport.authenticate("github", {
        //to tell what info do we need of user
        scope: ["user:email"],
    })
);

//route after user has logged in
router.get(
    "/github/callback",
    passport.authenticate("github", {
        //in case of fail, redirect
        failureRedirect: "/auth/github/login",
        //to not lose session data
        keepSessionInfo: true,
    }),
    //handler function to check
    (request, response) => {
        if (typeof request.session.redirectTo !== "string") {
            return response.status(500).end();
        }

        response.redirect(request.session.redirectTo);
    }
);

//LOGOUT route
router.get("/logout", (request, response, next) => {
    if (
        typeof request.query.redirectTo !== "string" ||
        !request.query.redirectTo
    ) {
        response.status(400);
        return next("Missing redirectTo query string parameter");
    }

    const redirectUrl = request.query.redirectTo;

    request.logout((error) => {
        if (error) {
            return next(error);
        }

        response.redirect(redirectUrl);
    });
});

export default router;
