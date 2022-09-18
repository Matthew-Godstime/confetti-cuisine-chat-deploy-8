import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

export function logError(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(error.stack);
    next();
}

export function pageNotFound(req: Request, res: Response): void {
    res.status(StatusCodes.NOT_FOUND);
    res.render("error");
}

export function internalServerError(error: Error, req: Request, res: Response): void {
    console.log(`ERROR OCCURRED: ${error.stack}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.send(`${StatusCodes.INTERNAL_SERVER_ERROR} | Sorry, our application is taking a nap!`)
}