let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static('dist'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + './dist/index.html');
});

let onlinenum = 0;

io.on('connection', function (socket) {
    onlinenum += 1;
    // console.log('a user connected', onlinenum);

    // 发送给所有人，包括发送者
    io.emit('onlinenum', {
        flag: 1,
        onlinenum
    });

    // 有人下线
    socket.on('disconnect', function () {
        onlinenum -= 1;
        // console.log('a user disconnected', onlinenum);
        io.emit('onlinenum', {
            flag: 0,
            onlinenum
        });
    })

    // 对于一个用户监听‘chat-message’，将会发送信息到所有人，BU包括发送者
    socket.on('chat-message', function (msg) {
        // console.log('say:', msg.msg_content);
        socket.broadcast.emit('chat-message', msg);
    })
});

http.listen(3000, function () {
    console.log('listening on: localhost:3000');
});