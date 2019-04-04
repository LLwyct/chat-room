let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static('dist'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + './dist/index.html');
});

let onlinenum = 0;

io.on('connection', function (socket) {
    console.log('a user connected');
    onlinenum += 1;



    socket.on('disconnect', function () {
        console.log('a user disconnected');
        onlinenum -= 1;
    })

    // 对于一个用户监听‘chat-message’，将会发送信息到所有人，包括发送者
    socket.on('chat-message', function (msg) {
        console.log('say:', msg.msg_content);
        io.emit('chat-message', msg)
    })
});

http.listen(3000, function () {
    console.log('listening on: localhost:3000');
});