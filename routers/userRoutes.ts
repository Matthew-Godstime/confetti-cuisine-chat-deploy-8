import express, { Router } from "express";
import {
    createUser, deleteUser, editUser, redirectUserView, showUser, validate, login,
    updateUser, userIndex, userIndexView, userNewView, userShowView, authenticate, logout, verifyAccount, verifyJWToken
} from "../controllers/userController.js";

const userRouter: Router = express.Router();

userRouter.get("/", userIndex, userIndexView)
userRouter.get("/new", userNewView);
userRouter.post("/create", validate, verifyAccount, verifyJWToken, createUser, authenticate);
userRouter.get("/login", login);
userRouter.post("/login", authenticate);
userRouter.get("/logout", logout, redirectUserView);
userRouter.get("/:id", showUser, userShowView);
userRouter.get("/:id/edit", editUser);
userRouter.put("/:id/update", updateUser, redirectUserView);
userRouter.delete("/:id/delete", deleteUser, redirectUserView);

export default userRouter;