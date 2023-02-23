const express = require("express"); //import express
const dotenv = require("dotenv");
const { chats } = require("./data/data"); //import chats from data
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();

connectDB();
const app = express(); //instance of express variable

app.use(express.json()); //to accept json data from frontend refer controllers/userControllers -> const { name, email, password, pic } = req.body;

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

//error handling middlewares, app.use for global middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

app.listen(PORT, console.log(`Server Started on PORT ${PORT}`.blue));
