import express, { Application } from "express";
import layouts from "express-ejs-layouts";
import mongoose from "mongoose";
import router from "./routers/index.js";
import methodOverride from "method-override";
import { config } from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import connectFlash from "connect-flash";
import { User } from "./models/user.js";
import expressValidator from "express-validator";
import { Server } from "socket.io";
import socket from "./controllers/chatController.js";
import morgan from "morgan";



config({ path: "./keys.env" });
mongoose.Promise = global.Promise;
const mongooseParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.connect(process.env.DATABASELG!, (mongooseParams as any), (error) => {
    if (error) {
        console.log("Error in connection");
    } else {
        console.log("Database was successfully connected");
    }
});
const app: Application = express();
// app.use(morgan("combined"));
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use(cookieParser(process.env.COOKIES_KEY));
app.use(expressSession({
    secret: process.env.COOKIES_KEY!,
    cookie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser((User.serializeUser() as any));
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
});
app.use(expressValidator()); // I stopped here
app.use("/", router);
const server = app.listen(app.get("port"), () => console.log(`Server running at http://localhost:${app.get("port")}`));
const io: Server = new Server(server);
socket(io);