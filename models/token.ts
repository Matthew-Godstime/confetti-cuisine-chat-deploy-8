import mongoose, { Model } from "mongoose";
import TokenInterface from "../interfaces/token";

const { Schema, model } = mongoose;

const tokenSchema = new Schema<TokenInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

const Token: Model<TokenInterface> = model("Token", tokenSchema);
export default Token;