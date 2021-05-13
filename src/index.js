const express = require('express');
const app = express();

const httpServer = require('http').Server(app)
const io = require('socket.io')(httpServer)

const morgan = require('morgan');
const handleBars  = require('express-handlebars');
const route = require('./routes');
const uuid = require("uuid");

const path = require('path');
const port = 3000;

app.engine('.hbs', handleBars({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(morgan('combined'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//route init
route(app)

io.on('connection', function (socket) {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
});

io.engine.generateId = (req) => {
    console.log(uuid.v4());
    return uuid.v4();
}

httpServer.listen(port);    