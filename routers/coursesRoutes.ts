import express, { Router } from "express";
import {
    coursesIndex, coursesIndexView, courseNewView, createCourses, redirectCourseView,
    showCourse, courseShowView, editCourse, updateCourse, deleteCourse, filterUserCourses, join
} from "../controllers/courseController.js";


const coursesRouter: Router = express.Router();

coursesRouter.get("/", coursesIndex, filterUserCourses, coursesIndexView)
coursesRouter.get("/new", courseNewView);
coursesRouter.post("/create", createCourses, redirectCourseView);
coursesRouter.get("/:id", showCourse, courseShowView);
coursesRouter.get("/:id/join", coursesIndex, join, filterUserCourses, redirectCourseView)
coursesRouter.get("/:id/edit", editCourse);
coursesRouter.put("/:id/update", updateCourse, redirectCourseView);
coursesRouter.delete("/:id/delete", deleteCourse, redirectCourseView);

export default coursesRouter;