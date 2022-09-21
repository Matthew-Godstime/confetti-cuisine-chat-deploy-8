import CustomError, { User } from "../models/user.js";
import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import Token from "../models/token.js";


config({ path: './keys.env' });
const customError = new CustomError();
// Get req body
export function getUserParams(body: any) {
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
function getDecodedParams(body: any) {
    return {
        name: {
            first: body.name.first,
            last: body.name.last,
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
function userSignUpView(req: Request, res: Response): void {
    res.render("users/signUp");
}

// Post request method for new user
function createUser(req: any, res: Response, next: NextFunction) {
    // The if statement used to be req.skip in javaScript
    const userData = res.locals.userData
    if (req.skip) next();
    let newUser = new User(getDecodedParams(userData));
    User.register(newUser, userData.password, (e: Error, user: any) => {
        if (user) {
            // req.flash("success", `${user.fullName}'s account created successfully!`);
            res.render("verification/userActivated");
            console.log("Created");
            
        } else {
            req.flash("error", `Failed to create user account because: ${customError.message}.`);
            res.locals.redirect = "/users/new";
            next(e)
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

// render a forgot password view
function forgotPassword(req: Request, res: Response) {
    res.render("ForgotAndReset/forgotPassword");
}

function resetPassword(req: Request, res: Response) {
    const token = req.query.token;
    res.render("ForgotAndReset/resetPassword", { token: token });
}

function changePassword(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.userNewData.decoded.id;
    const newPass = res.locals.userNewData.newPass;
    if (res.locals.userNewData) {
        User.findById(user).exec().then((user: any) => {
            if (user) {
                user.setPassword(newPass, (error: any, user: any) => {
                    if (error) {
                        req.flash("error", "Error occurred while changing password");
                        next(error);
                    }
                    user.save();
                    Token.findOne({ userId: user._id }).exec().then((token) => {
                        token?.deleteOne();
                        console.log("Deletion of the token was a success");
                    }).catch(error => {
                        console.log("Error while deleting the used token");
                        next(error);
                    })
                    res.locals.userLoginDetails = { email: user.email, pass: newPass };
                    res.render("ForgotAndReset/login");
                })
            }
        })
    }
}



export {
    userIndex, userIndexView, userSignUpView, createUser, redirectUserView, authenticate, logout,
    showUser, userShowView, editUser, updateUser, deleteUser, login, validate, forgotPassword, resetPassword, changePassword
}