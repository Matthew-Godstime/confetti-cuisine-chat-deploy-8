import CustomError, { User } from "../models/user.js";
import passport from "passport";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { Req } from "../interfaces/user.js";
import sendEmail from "../Utils/Email/sendEmail.js";
import { config } from "dotenv";

config({path: './keys.env'});
const customError = new CustomError();
// Get req body
function getUserParams(body: any) {
    return {
        name: {
            first: body.first,
            last: body.last,
        },
        email: body.email,
        zipCode: parseInt(body.zipCode),
        password: body.password
    };
}

// Search the database for all user
function userIndex(req: Request, res: Response, next: NextFunction): void {
    User.find().then(users => {
        res.locals.users = users;
        next();
    }).catch(error => {
        console.log(`Error fetching user: ${error}`);
        next(error);
    })
}

// Display user index view
function userIndexView(req: Request, res: Response): void {
    res.render("users/index");
}

// Display user form
function userNewView(req: Request, res: Response): void {
    res.render("users/new");
}

// Post request method for new user
function createUser(req: any, res: Response, next: NextFunction) {
    // The if statement used to be req.skip in javaScript
    if (req.skip) next();
    let newUser = new User(getUserParams(req.userParams));
    console.log("Line 50",newUser);
    
    User.register(newUser, req.body.password, (e: Error, user: any) => {
        if (user) {
            req.flash("success", `${user.fullName}'s account created successfully!`);
            // res.locals.redirect = "/users";
            next();
        } else {
            req.flash("error", `Failed to create user account because: ${customError.message}.`);
            res.locals.redirect = "/users/new";
            next()
        }
    })
}

// authenticate
const authenticate = passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login",
    successRedirect: "/",
    successFlash: "Logged In!"
})

// Redirect view
function redirectUserView(req: Request, res: Response, next: NextFunction): void {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
}

// Fetch a user data
function showUser(req: Request, res: Response, next: NextFunction): void {
    let userId: string = req.params.id;
    User.findById(userId).then(user => {
        res.locals.user = user;
        next();
    }).catch(error => {
        console.log(`Error fetching user by ID: ${error}`)
        next(error);
    })
}

// Display User data
function userShowView(req: Request, res: Response): void {
    res.render("users/show");
}

// Display edit form for editing
function editUser(req: Request, res: Response, next: NextFunction): void {
    let userId: string = req.params.id;
    User.findById(userId).then(user => {
        res.render("users/edit", { user: user });
    }).catch(error => {
        console.log(`Error fetching user by ID: ${error}`);
        next(error);
    })
}

// Update the edited details
function updateUser(req: Request, res: Response, next: NextFunction): void {
    let userId: string = req.params.id;
    let userParams = getUserParams(req.body);
    User.findByIdAndUpdate(userId, { $set: userParams }).then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
    }).catch(error => {
        console.log(`Error updating user by ID: ${error}`);
        next(error);
    })
}

// Delete user
function deleteUser(req: Request, res: Response, next: NextFunction): void {
    let userId: string = req.params.id;
    User.findByIdAndRemove(userId).then(() => {
        res.locals.redirect = "/users"
        next();
    }).catch(error => {
        console.log(`Error deleting user by ID: ${error}`);
        next();
    })
}

function login(req: Request, res: Response): void {
    res.render("users/login");
}

function validate(req: any, res: Response, next: NextFunction) {
    req.sanitizeBody("email").normalizeEmail({ all_lowercase: true }).trim();
    req.check("email", "Email is invalid").isEmail();
    req.check("zipCode", "Zip code is invalid").notEmpty().isInt().isLength({ min: 5, max: 5 }).equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then((error: any) => {
        if (!error.isEmpty()) {
            let messages = error.array().map((e: any) => e.msg);
            req.skip = true; // I used to add this line in JavaScript
            req.flash("error", messages.join(" and "));
            res.locals.redirect = "/users/new";
            next();
        } else {
            next();
        }
    })
}

function logout(req: Request, res: Response, next: NextFunction): void {
    req.logout((error) => {
        if (error) return next(error);
    })
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
}

function verifyAccount(req: any, res: Response, next: NextFunction) {
    const userParams = getUserParams(req.body);
    User.findOne({ email: userParams.email }).exec()
        .then(user => {
            if (user) {
                console.log("User", user);
                req.flash("error", customError.message);
                req.skip = true;
                res.locals.redirect = "/users/new"
                next();
            }
            const token = jsonwebtoken.sign(userParams, (process.env.JWT_ACC_ACTIVATE as any), { expiresIn: '20m' });
            const link: string = `${process.env.CLIENT_URL}/users/create?token=${token}`
            sendEmail(userParams.email, "Account Verification", { user: userParams, link: link }, "C:/gtech/Node/get-programming-with-nodejs/Pratical/confetti cuisine chat deploy 8/Utils/Template/resetPassword.ejs", req, res, next);
            console.log(userParams);
        }).catch(error => {
            console.log(`Error ${error.message}`);
            next(error);
        })
}

function verifyJWToken(req: any, res: Response, next: NextFunction) {
    const token = req.query.token;
    if (req.skip) next();
    if (token) {
        jsonwebtoken.verify((token as any), (process.env.JWT_ACC_ACTIVATE as any), (error: any, decoded: any) => {
            if (error) {
                req.flash("error", "Incorrect or expired link.");
                req.skip = true;
                console.log("Error 195", error);
                next(error);
            }
            req.userParams = decoded;
            console.log("User params", req.userParams);
            
            next();
            // const userParams = decoded;
            // User.findOne({ email: userParams.email }).exec()
            //     .then(user => {
            //         if (user) {
            //             req.flash("error", customError.message);
            //             req.skip = true;
            //             next();
            //         }
            //         next();
            // })
        })
    }
    next();
}

export {
    userIndex, userIndexView, userNewView, createUser, redirectUserView, authenticate, logout,
    showUser, userShowView, editUser, updateUser, deleteUser, login, validate, verifyAccount, verifyJWToken
}