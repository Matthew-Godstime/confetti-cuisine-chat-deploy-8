import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Course } from "../models/course.js";
import { User } from "../models/user.js";

// Get req body
function getCourseParams(body: any) {
    return {
        title: body.title,
        description: body.description,
        maxStudents: body.maxStudents,
        cost: body.cost,
    };
}

// Search the database for all courses
function coursesIndex(req: Request, res: Response, next: NextFunction): void {
    Course.find().then(courses => {
        res.locals.courses = courses;
        next();
    }).catch(error => {
        console.log(`Error fetching courses: ${error}`);
        next(error);
    })
}

// Display courses index view
function coursesIndexView(req: Request, res: Response): void {
    res.render("courses/index")
}

// Display course form
function courseNewView(req: Request, res: Response): void {
    res.render("courses/new");
}

// Post request method for new course
function createCourses(req: Request, res: Response, next: NextFunction): void {
    let courseParams = getCourseParams(req.body);
    Course.create(courseParams).then(course => {
        res.locals.course = course;
        res.locals.redirect = "/courses";
        next();
    }).catch(error => {
        console.log(`Error saving course :${error}`);
        next(error);
    })
}

// Redirect view
function redirectCourseView(req: Request, res: Response, next: NextFunction): void {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
}

// Fetch a course data
function showCourse(req: Request, res: Response, next: NextFunction): void {
    let course = req.params.id;
    Course.findById(course).then(course => {
        res.locals.course = course;
        next();
    }).catch(error => {
        console.log(`Error fetching course by ID: ${error}`)
        next(error);
    })
}

// Display subscriber data
function courseShowView(req: Request, res: Response): void {
    res.render("courses/show");
}

// Display edit form for editing
function editCourse(req: Request, res: Response, next: NextFunction): void {
    let courseId = req.params.id;
    Course.findById(courseId)
        .then(course => {
            res.render("courses/edit", {course: course})
        })
        .catch(error => {
            console.log(`Error fetching course by ID: ${error}`);
            next(error);
    })
}

// Update the edited details
function updateCourse(req: Request, res: Response, next: NextFunction): void {
    let courseId = req.params.id;
    let courseParams = getCourseParams(req.body);
    Course.findByIdAndUpdate(courseId, { $set: courseParams })
        .then(course => {
            res.locals.course = course;
            res.locals.redirect = `/courses/${courseId}`;
            next();
        }).catch(error => {
            console.log(`Error updating course by ID: ${error}`);
            next(error);
    })
}

// Delete a course
function deleteCourse(req: Request, res: Response, next: NextFunction): void {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId).then(() => {
        res.locals.redirect = "/courses"
        next();
    }).catch(error => {
        console.log(`Error deleting course by ID: ${error}`);
        next();
    })
}

// Responding with JSON format
function respondJSON(req: Request, res: Response) {
    res.json({ status: StatusCodes.OK, data: res.locals });
}

// Handle any error while parsing JSON
function errorJSON(error: Error, req: Request, res: Response, next: NextFunction) {
    let errorObject;
    if (error) {
        errorObject = {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        }
    } else {
        errorObject = {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Unknown Error."
        }
    }
    res.json(errorObject);
}

// Filter the courses for joined and unjoined
function filterUserCourses(req: Request, res: Response, next: NextFunction) {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
        let mappedCourses = res.locals.courses.map((course: any) => {
            let userJoined = currentUser.courses.some((userCourses: any) => {
                return userCourses.equals(course._id);
            })
            return Object.assign(course.toObject(), { joined: userJoined });
        })
        res.locals.courses = mappedCourses;
        next();
    } else {
        next();
    }
}

// Join a course
function join(req: Request, res: Response, next: NextFunction) {
    let courseId = req.params.id;
    let currentUser = req.user;
    let joined = { courses: courseId }
    if (currentUser) {
        User.findByIdAndUpdate(currentUser, { $addToSet: joined })
            .then(() => {
                res.locals.success = true;
                // if (!req.url.includes("api")) res.locals.redirect = "/courses";
                next();
            }).catch(error => {
                next(error);
        })
    } else {
        next(new Error("User must log in."))
    }
}

export {
    coursesIndex, coursesIndexView, courseNewView, createCourses, redirectCourseView, respondJSON, errorJSON, 
    showCourse, courseShowView, editCourse, updateCourse, deleteCourse, filterUserCourses, join
}