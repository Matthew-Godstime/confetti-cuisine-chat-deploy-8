import { Request, Response } from "express";

export function homeIndex(req: Request, res: Response): void {
    res.render("index");
}


export function chat(req: Request, res: Response) {
    res.render("chat");
}