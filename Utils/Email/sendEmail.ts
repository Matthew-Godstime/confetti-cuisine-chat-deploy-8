import { createTransport, SendMailOptions } from "nodemailer";
import { NextFunction, Request, Response } from "express";
import { readFileSync } from "fs";
import { compile } from "ejs";
import { config } from "dotenv";

config({path: '../keys.env'});
export default function sendEmail(email: string, subject: any, payload: object, template: string, req?: Request, res?: Response, next?: NextFunction) {
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
        from: `GTech Team ${process.env.EMAIL}`,
        to: email,
        subject: subject,
        html: compiledTemplate(payload)
    };
    console.log("User Email", mailOption);

    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            req?.flash("error", `Error occurred while parsing token ${error}`)
            // next()?;
        } else {
            console.log("Email successfully sent");
            
            res?.render("Verification/emailSent");
        }
    })    
}