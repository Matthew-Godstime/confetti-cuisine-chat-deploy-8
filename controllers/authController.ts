import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import sendEmail from "../Utils/Email/sendEmail.js";
import { getUserParams } from "./userController.js";
import CustomError from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";
import { config } from "dotenv";
import Token from "../models/token.js";
import TokenInterface from "../interfaces/token.js";



config({ path: './keys.env' });

const customError = new CustomError();

// Send a token via mail to the newly registered user, for verification
function verifyAccount(req: any, res: Response, next: NextFunction) {
    if (!req.skip) {
        const userParams = getUserParams(req.body);
        User.findOne({ email: userParams.email }).exec().then(user => {
            if (user) {
                req.flash("error", customError.message);
                res.locals.redirect = "/users/signUp";
                next();
            } else {
                const token = jsonwebtoken.sign(userParams, (process.env.JWT_ACC_ACTIVATE as any), { expiresIn: '10m' });
                const link: string = `${process.env.CLIENT_URL}/user/${userParams.email}/activated/create?token=${token}`
                sendEmail(userParams.email, "Account Verification", { user: userParams, link: link }, "./Utils/Template/verifyAccount.ejs", req, res, next);
            }
        }).catch(error => {
            console.log(`Error ${error.message}`);
            next(error);
        })
    } else {
        next();
    }
    
}

// Verify the new registered user
function verifyJWToken(req: any, res: Response, next: NextFunction) {
    const token = req.query.token;
    if (token) {
        jsonwebtoken.verify((token as any), (process.env.JWT_ACC_ACTIVATE as any), (error: any, decoded: any) => {
            if (error) {
                req.flash("error", "Incorrect or expired link. Enter your email again to get a valid token");
                res.locals.redirect = "/users/forgotPassword"
                req.skip = true;
                next();
            } else {
                res.locals.userData = decoded;
                next();
            }
        })
    }
}

// Get user email to send token
function forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    User.findOne({ email: email }).exec().then(user => {
        if (user) {
            const token: string = jsonwebtoken.sign({ id: user._id }, (process.env.RESET_PASSWORD as any), { expiresIn: '10m' });
            Token.findOne({ userId: user }).exec().then(userExistingToken => {
                if (userExistingToken) {
                    userExistingToken.deleteOne();
                }
                const userToken: TokenInterface = {
                    userId: user,
                    token: token
                }
                Token.create(userToken).then(() => {
                    console.log("Token has been created");
                }).catch(error => {
                    console.log("Unable to create token", error);
                    next(error);
                })
                const link: string = `${process.env.CLIENT_URL}/users/${email}/resetPassword?token=${token}`
                sendEmail(email, "Password Reset", { user: user, link: link }, "./Utils/Template/resetPassword.ejs", req, res, next);
            }).catch(error => {
                console.log("Error in finding token", error);
                next(error);
            })
        } else {
            req.flash("error", "User does not exist");
            res.locals.redirect = "/users/forgotPassword"
            next();
        }
    }).catch(error => {
        console.log("Error in finding User", error);
        next(error);
    })
}


// Verify the token
function verifyPasswordToken(req: any, res: Response, next: NextFunction) {
    const { newPass, token } = req.body;
    if (token) {
        jsonwebtoken.verify((token as any), (process.env.RESET_PASSWORD as any), (error: any, decoded: any) => {
            if (error) {
                req.flash("error", "Incorrect or expired link.");
                res.locals.redirect = `/users/${token}/resetPassword`;
                req.skip = true;
                next();
            } else {
                res.locals.userNewData = { newPass: newPass, decoded: decoded };
                next();
            }
        })
    }
}

export { verifyAccount, verifyJWToken, forgotPassword, verifyPasswordToken };