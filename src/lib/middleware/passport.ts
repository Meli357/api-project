import passport from "passport";
import passportGithub2 from "passport-github2";

//strategies are used for authenticate
const githubStrategy = new passportGithub2.Strategy(
    //configuration settings
    {
        clientID: "",
        clientSecret: "",
        callbackURL: "",
    },
    //add verify callback function, after someone has logged
    function (
        accessToken: string,
        refreshToken: string,
        profile: { [key: string]: string },
        done: (error: null, user: Express.User) => void
    ) {
        //to store user
        const user: Express.User = {
            username: profile.username,
        };

        done(null, user);
    }
);

passport.use(githubStrategy);

//to store user data on session
passport.serializeUser<Express.User>((user, done) => done(null, user));

//to retrieve user data from session
passport.deserializeUser<Express.User>((user, done) => done(null, user));

export { passport };
