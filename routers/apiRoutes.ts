import express, { Router } from "express";
import { coursesIndex, errorJSON, filterUserCourses, join, respondJSON } from "../controllers/courseController.js";


const apiRouts: Router = express.Router();


apiRouts.get("/courses", coursesIndex, filterUserCourses, respondJSON);
apiRouts.get("/courses/:id/join", join, respondJSON);
apiRouts.use(errorJSON);

export default apiRouts;