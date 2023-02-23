//import { Schema } from "mongoose";
const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId, //id of users
                ref: "User",
            },
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId, //id of latest message
            ref: "Message",
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId, //id of group admin ie a user himself
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
