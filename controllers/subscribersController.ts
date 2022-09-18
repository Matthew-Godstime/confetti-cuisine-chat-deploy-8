import { Subscriber } from "../models/subscriber.js";
import { Course } from "../models/course.js";
import { NextFunction, Request, Response } from "express";
import { CourseInterface } from "../interfaces/course.js";
import { SubscriberInterface } from "../interfaces/subscriber.js";


// Get req body
function getSubscriberParams(body: any) {
    return {
        name: body.name,
        email: body.email,
        zipCode: parseInt(body.zipCode),
    };
}

// Search the database for all subscribers
function subscriberIndex(req: Request, res: Response, next: NextFunction): void {
    Subscriber.find()
        .then(subscribers => {
            res.locals.subscribers = subscribers;
            next();
        })
        .catch(error => {
            console.log(`Error fetching subscribers: ${error}`);
            next(error);
        });
}

// Display subscribers index view
function subscribersIndexView(req: Request, res: Response): void {
    res.render("subscribers/index");
}

// Display subscribers form
function subscribersNewView(req: Request, res: Response): void {
    res.render("subscribers/new");
}

// Post request method for new subscribers
function createSubscriber(req: Request, res: Response, next: NextFunction): void {
    let subscriberParams: any = getSubscriberParams(req.body);
    Subscriber.create(subscriberParams).then(subscriber => {
        res.locals.redirect = "/subscribers";
        res.locals.subscriber = subscriber;
        next();
    }).catch(error => {
        console.log(`Error saving subscriber:${error}`);
        next(error);
    })
}

// Redirect view
function redirectSubscriberView(req: Request, res: Response, next: NextFunction): void {
    let redirectPath: string = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
}

// Fetch a subscriber data
function showSubscriber(req: Request, res: Response, next: NextFunction): void {
    let subscriberId: string = req.params.id;
    Subscriber.findById(subscriberId).then(subscriber => {
        res.locals.subscriber = subscriber;
        next();
    })
        .catch(error => {
            console.log(`Error fetching subscriber by ID: ${error}`)
            next(error);
        })
}

// Display subscriber data
function subscriberShowView(req: Request, res: Response): void {
    res.render("subscribers/show");
}

// Display edit form for editing
function editSubscriber(req: Request, res: Response, next: NextFunction): void {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
        .then(subscriber => {
            res.render("subscribers/edit", { subscriber: subscriber });
        }).catch(error => {
            console.log(`Error fetching subscriber by ID: ${error}`);
            next(error);
        })
}

// Update the edited details
function updateSubscriber(req: Request, res: Response, next: NextFunction): void {
    let subscriberId = req.params.id;
    let subscriberParams = getSubscriberParams(req.body);
    Subscriber.findByIdAndUpdate(subscriberId, { $set: subscriberParams })
        .then(subscriber => {
            res.locals.redirect = `/subscribers/${subscriberId}`;
            res.locals.subscriber = subscriber;
            next();
        })
        .catch(error => {
            console.log(`Error updating subscriber by ID: ${error}`);
            next(error);
        })
}

// Delete subscriber
function deleteSubscriber(req: Request, res: Response, next: NextFunction): void {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
        .then(() => {
            res.locals.redirect = "/subscribers";
            next();
        })
        .then(error => {
            console.log(`Error deleting subscriber by ID: ${error}`);
            next();
        })
}

export {
    subscriberIndex, subscribersIndexView, subscribersNewView, createSubscriber, redirectSubscriberView, showSubscriber,
    subscriberShowView, editSubscriber, updateSubscriber, deleteSubscriber
}


function getSubscribeCourses(req: Request, res: Response, next: NextFunction): void {
    let course: CourseInterface | null;
    let courseId = req.params.id;
    Course.findById(courseId).then(c => course = c);
    Subscriber.findOne().then((subscriber: any) => {
        subscriber.courses.push(course);
        subscriber.save();
        res.locals.redirect = "/subscribers"
        next();
    }).catch(error => {
        console.log("Sorry couldn't subscribe: ", error)
    })
}

// Populate Subscriber data
function populateData(subscriber: SubscriberInterface, result: any) {
    if (subscriber.courses[0]) {
        Subscriber.populate(subscriber, "courses").then(data => {
            result(data.courses);
        })
    }
}
