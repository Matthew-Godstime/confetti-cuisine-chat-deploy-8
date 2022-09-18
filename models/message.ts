import mongoose, { Model } from "mongoose";
import { MessageInterface } from "../interfaces/message";

const { Schema, model } = mongoose;

const messageSchema = new Schema<MessageInterface>({
    content: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

const Message: Model<MessageInterface> = model("Message", messageSchema)

export default Message;