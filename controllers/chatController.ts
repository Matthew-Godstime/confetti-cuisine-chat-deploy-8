import { Server, Socket } from "socket.io";
import { MessageInterface } from "../interfaces/message";
import Message from "../models/message.js";

export default function socket(io: Server) {
    io.on("connection", (client: Socket) => {
        console.log("New Connection");
        Message.find().sort({ createdAt: -1 }).limit(10)
            .then(messages => {
                client.emit("load all messages", messages.reverse());
            });
        client.on("disconnect", () => {
            console.log("user disconnect");
        });

        client.on("message", (data) => {
            let messageAttributes: MessageInterface = {
                content: data.content,
                userName: data.userName,
                user: data.userId
            };
            let message = new Message(messageAttributes);
            message.save().then(() => io.emit("message", messageAttributes));
        })
        
    })
}