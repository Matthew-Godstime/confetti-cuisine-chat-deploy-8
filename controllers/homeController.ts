import { Request, Response } from "express";

export function homeIndex(req: Request, res: Response): void {
    res.render("index");
}


export function chat(req: Request, res: Response) {
    if (res.locals.loggedIn) res.render("chat");
    else {
        req.flash("error", "Login in first to chat");
        res.redirect("/users/login");
    }
}