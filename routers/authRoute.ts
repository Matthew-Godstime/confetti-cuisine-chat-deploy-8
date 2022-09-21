import express, { Router } from "express";
import { authenticate, changePassword, createUser, redirectUserView, validate } from "../controllers/userController.js";
import { forgotPassword, verifyAccount, verifyJWToken, verifyPasswordToken } from "../controllers/authController.js";


const authRouter: Router = express.Router();


authRouter.post("/authenticate/activate", validate, verifyAccount);
authRouter.post("/authenticate/forgotPassword", forgotPassword);
authRouter.put("/authenticate/resetPassword", verifyPasswordToken, changePassword, authenticate);
authRouter.get("/:id/activated/create", verifyJWToken, createUser, redirectUserView);


export default authRouter;