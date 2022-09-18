import mongoose from "mongoose";
const { Schema, model} = mongoose;
import { Subscriber } from "./subscriber.js";
import passportLocalMongoose from "passport-local-mongoose";
import { UserInterface } from "../interfaces/user.js";

const userSchema = new Schema<UserInterface>({
    name: {
        first: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            trim: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    zipCode: {
        type: Number,
        min: [10000, "Zip code too short"],
        max: 99999
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

userSchema.virtual("fullName").get(function () {
    return `${this.name?.first} ${this.name?.last}`;
});

userSchema.pre("save", function (next) {
    let user: any = this;
    if (user.subscribedAccount === undefined) {
        Subscriber.findOne({ email: user.email })
            .then(subscriber => {
                user.subscribedAccount! = subscriber;
                next();
            })
            .catch(error => {
                console.log(`Error in connecting subscriber: ${error}`);
                next(error);
            })
    } else {
        next();
    }
});

export const User = model("User", userSchema);


export default class CustomError extends mongoose.Error {
    constructor() {
        super("A user with the given email address is already registered");
    }
}