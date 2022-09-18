import express, { Router } from "express";
import { homeIndex, chat } from "../controllers/homeController.js";


const homeRouter: Router = express.Router();

homeRouter.get("/chat", chat);
homeRouter.get("/", homeIndex);

export default homeRouter;