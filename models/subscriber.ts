import mongoose, { Model } from "mongoose";
import { SubscriberInterface } from "../interfaces/subscriber";
const { Schema, model } = mongoose;


const subscriberSchema = new Schema<SubscriberInterface>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    zipCode: {
        type: Number,
        min: [10000, "Zip code too short"],
        max: 99999
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
}, { timestamps: true });

subscriberSchema.methods.getInfo = function () {
    return `Name: ${this.name} Email: ${this.email} zipCode: ${this.zipCode}`
}

export const Subscriber: Model<SubscriberInterface> = model("Subscriber", subscriberSchema)