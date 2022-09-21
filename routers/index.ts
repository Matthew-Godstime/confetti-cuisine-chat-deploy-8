import express, { Router } from "express";
import apiRouts from "./apiRoutes.js";
import authRouter from "./authRoute.js";
import coursesRouter from "./coursesRoutes.js";
import errorRouter from "./errorRoutes.js";
import homeRouter from "./homeRoutes.js";
import subscribersRouter from "./subscribersRoutes.js";
import userRouter from "./userRoutes.js";


const router: Router = express.Router();
router.use("/user", authRouter)
router.use("/users", userRouter);
router.use("/subscribers", subscribersRouter);
router.use("/courses", coursesRouter);
router.use("/api", apiRouts);
router.use("/", homeRouter);
router.use("/", errorRouter);

export default router;