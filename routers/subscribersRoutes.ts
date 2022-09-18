import express, { Router } from "express";
import {
    subscribersIndexView, subscriberIndex, createSubscriber, deleteSubscriber, editSubscriber, redirectSubscriberView,
    showSubscriber, subscriberShowView, subscribersNewView, updateSubscriber
} from "../controllers/subscribersController.js";

const subscribersRouter: Router = express.Router();


subscribersRouter.get("/", subscriberIndex, subscribersIndexView);
subscribersRouter.get("/new", subscribersNewView);
subscribersRouter.post("/create", createSubscriber, redirectSubscriberView);
subscribersRouter.get("/:id", showSubscriber, subscriberShowView);
subscribersRouter.get("/:id/edit", editSubscriber);
subscribersRouter.put("/:id/update", updateSubscriber, redirectSubscriberView);
subscribersRouter.delete("/:id/delete", deleteSubscriber, redirectSubscriberView);

export default subscribersRouter;