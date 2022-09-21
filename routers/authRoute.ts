import express, { Router } from "express";
import { authenticate, changePassword, createUser, redirectUserView, validate } from "../controllers/userController.js";
import { forgotPassword, verifyAccount, verifyJWToken, verifyPasswordToken } from "../controllers/authController.js";


const authRouter: Router = express.Router();


authRouter.post("/authenticate/activate", validate, verifyAccount, redirectUserView);
authRouter.get("/:id/activated/create", verifyJWToken, createUser, redirectUserView);
authRouter.post("/authenticate/forgotPassword", forgotPassword, redirectUserView);
authRouter.put("/authenticate/resetPassword", verifyPasswordToken, changePassword, redirectUserView, authenticate);


export default authRouter;