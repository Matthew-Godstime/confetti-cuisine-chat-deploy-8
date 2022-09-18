import express, { Router } from "express";
import { logError, pageNotFound, internalServerError } from "../controllers/errorController.js";


const errorRouter: Router = express.Router();

errorRouter.use(logError);
errorRouter.use(pageNotFound);
errorRouter.use(internalServerError);

export default errorRouter;