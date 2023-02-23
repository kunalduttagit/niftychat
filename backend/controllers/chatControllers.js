const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("User id param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        //also populate information about those users
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        //chat exits between two people
        res.send(isChat[0]); //becuase find() returns an array of objects, take first one
    } else {
        //if doesn't exits, create new chat
        var chatData = {
            chatName: "sender", //so sender means a one-on-one group chat in this project
            isGroupchat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({
                _id: createdChat._id,
            }).populate("users", "-password"); //assign a chat id and populate as above
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChat = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async result => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });

                res.status(200).send(result);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    var users = JSON.parse(req.body.users); //a json string will be sent fron frontend

    if (users.length < 2) {
        return res.status(400).send({
            message:
                "Atleast 2 or more users are required to form a group chat.",
        });
    }

    users.push(req.user); //push current user who's creating group chat

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    //as key an value pair same for chatName, so just chatname would suffice
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.send(400);
        throw new Error("Chat not found");
    } else {
        res.status(200).json(updatedChat);
    }

    // try {
    //     const oldName = req.body.oldName;
    //     const newName = req.body.newName; console.log('name assigned', newName);
    //     const chatname = await Chat.findOne({ chatName: oldName });  console.log("found", chatname.name);
    //     const newChat = await Chat.updateOne({ _id: chatname._id }, { $set: { chatName: newName } });  console.log("updated", newChat.name);
    //     res.status(200).json(newChat);
    // } catch (error) {
    //     res.status(200);
    //     throw new Error(error.message);
    // }
});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    console.log('initialized')
    const added = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    console.log('added and pop')
    if (!added) {
        res.status(400);
        throw new Error('Chat not found');
    } else {
        res.json(added);
    }
    console.log('completee');
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(400);
        throw new Error("Chat not found");
    } else {
        res.json(removed);
    }
})

module.exports = {
    accessChat,
    fetchChat,
    createGroupChat,
    renameGroupChat,
    addToGroup,
    removeFromGroup
};