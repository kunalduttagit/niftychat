const express = require('express'); //import express
const dotenv = require('dotenv');
const { chats } = require('./data/data'); //import chats from data
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { instrument } = require('@socket.io/admin-ui');

dotenv.config();

connectDB();
const app = express(); //instance of express variable

app.use(express.json()); //to accept json data from frontend refer controllers/userControllers -> const { name, email, password, pic } = req.body;

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

//error handling middlewares, app.use for global middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`.blue));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: ['http://localhost:3000', 'https://admin.socket.io/'], //app or frontend
    },
});

instrument(io, {
    auth: false,
});

io.on('connection', socket => {
    console.log('Socket.io listening on port 3000'.magenta.bold);

    socket.on('setup', userData => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('joinChat', room => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    })

    socket.on('typing', room => socket.in(room).emit('typing'));
    socket.on('stop typing', room => socket.in(room).emit('stop typing'));
    socket.on('leave room', room => { socket.leave(room); console.log('left: '+ room)})

    socket.on('new message', newMessageReceived => {
        var chat = newMessageReceived.chat

        if (!chat.users) return console.log('No users available for this chat');
        
        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })

    socket.off('setup', () => {
        console.log("User Disconnected")
        socket.leave(userData._id)
    })
});
