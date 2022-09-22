import express, { Router } from "express";
import { authenticate, changePassword, createUser, redirectUserView, validate } from "../controllers/userController.js";
import { forgotPassword, activateAccount, signUp, verifyPasswordToken } from "../controllers/authController.js";


const authRouter: Router = express.Router();


authRouter.post("/authenticate/activate", validate, signUp, redirectUserView);
authRouter.get("/:id/activated/create", activateAccount, createUser, redirectUserView);
authRouter.post("/authenticate/forgotPassword", forgotPassword, redirectUserView);
authRouter.put("/authenticate/resetPassword", verifyPasswordToken, changePassword, redirectUserView);


export default authRouter;