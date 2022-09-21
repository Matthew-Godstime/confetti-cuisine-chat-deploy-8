import express, { Router } from "express";
import {
    createUser, deleteUser, editUser, redirectUserView, showUser, validate, login,
    updateUser, userIndex, userIndexView, userSignUpView, userShowView, authenticate, logout, forgotPassword, resetPassword,
} from "../controllers/userController.js";

const userRouter: Router = express.Router();

userRouter.get("/", userIndex, userIndexView)
userRouter.get("/signUp", userSignUpView);
userRouter.get("/login", login);
userRouter.post("/login", authenticate);
userRouter.get("/logout", logout, redirectUserView);
userRouter.get("/forgotPassword", forgotPassword);
userRouter.get("/:id/resetPassword", resetPassword);
userRouter.get("/:id", showUser, userShowView);
userRouter.get("/:id/edit", editUser);
userRouter.put("/:id/update", updateUser, redirectUserView);
userRouter.delete("/:id/delete", deleteUser, redirectUserView);

export default userRouter;