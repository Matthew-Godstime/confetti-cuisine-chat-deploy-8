import { Request } from "express"

export interface UserInterface {
    name: {
        first: string,
        last: string
    },
    email: string,
    zipCode: number,
    courses: object[],
    subscribedAccount: object | undefined
}

export interface Req extends Request {
    skip: boolean,
}