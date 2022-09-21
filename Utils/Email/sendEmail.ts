import { createTransport, SendMailOptions } from "nodemailer";
import { NextFunction, Request, Response } from "express";
import { readFileSync } from "fs";
import { compile } from "ejs";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";

config({path: '../keys.env'});
export default function sendEmail(email: string, subject: any, payload: object, template: string, req: Request, res: Response, next: NextFunction) {
    const transporter = createTransport({
        host: process.env.HOST,
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        }
    });

    const compiledTemplate = compile(readFileSync(template, "utf8"));
    const mailOption: SendMailOptions = {
        from: process.env.GTECH,
        to: email,
        subject: subject,
        html: compiledTemplate(payload)
    };
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            console.log("Error occurred while sending mail", error);
            res.status(StatusCodes.FAILED_DEPENDENCY).send("Couldn't send mail. Try again");
            next(error);
        } else {
            if (mailOption.subject === "Account Verification") {
                res.render("verification/emailSent");
            } else {
                res.render("ForgotAndReset/emailSent");
            }
        }
    })    
}