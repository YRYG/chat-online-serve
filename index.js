const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const userList = [];
const messageList = [];


app.get('/', (req, res) => {
    // res.send('<h1>Hello World!!</h1>')
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('a user connected');

    // 用户点击确定进入聊天室  data：{name:'',uid:'', pic:''}
    socket.on('save info', (data) => {
        userList.push(data)

        let startIndex = messageList.length - 10 <= 0 ? 0 : messageList.length - 10;
        let historyList = JSON.parse(JSON.stringify(messageList.slice(startIndex, messageList.length)))

        io.emit('save info', {
            historyList,
            userList,
        });
        io.emit('chat message', {
            info: data,
            msg: "",
            type: "join",
        });
    });

    // 接收用户发送来的信息
    socket.on('chat message', (data) => {
        messageList.push(data);
        io.emit('chat message', data);
    });
})

function generateUUID() {
    var d = new Date().getTime();

    // if (window.performance && typeof window.performance.now === "function") {
    //     d += performance.now(); //use high-precision timer if available
    // }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

http.listen(3000, () => {
    console.log('listening in 3000');
})