import mongoose, {Model} from "mongoose";
import { CourseInterface } from "../interfaces/course";
const { Schema, model } = mongoose;

const courseSchema = new Schema<CourseInterface>({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    maxStudents: {
        type: Number,
        default: 0,
        min: [0, "Course cannot have a negative number of students"]
    },
    cost: {
        type: Number,
        default: 0,
        min: [0, "Course cannot have a negative cost"]
    }
}, { timestamps: true });


export const Course: Model<CourseInterface> = model("Course", courseSchema);