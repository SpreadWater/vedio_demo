const fs = require("fs");
const express = require("express");
// 前端调起摄像头的功能需要https下
const { createServer } = require("https");

const app = express();

// 证书配置
var options = {
    key: fs.readFileSync('./cert/server.key'),
    cert: fs.readFileSync('./cert/server.crt')
}

const httpServer = createServer(options, app);
const io = require("socket.io")(httpServer, {
    // 跨域配置
    cors: {
        origin: true,
    }
});

app.get('/', (req, res) => {
    res.send('123')
})

io.on("connection", (socket) => {
    socket.emit('init', { id: socket.id })
    socket.on('join private room', async (arg, cb) => {
        // 判断自己是否有rooms了
        if ([...socket.rooms].length >= 2) return cb({
            message: '已经加入一个房间了',
            success: false,
        })

        // 判断房间是否满两个人了
        let allSockets = await io.fetchSockets()
        let targetSocket = allSockets.filter(_ => [..._.rooms].includes(arg.room))
        if (targetSocket.length >= 2) return cb({
            message: '房间已满员',
            success: false,
        })

        // 加入房间
        socket.join(arg.room)

        let obj = {
            message: '加入成功',
            success: true,
        }
        targetSocket = allSockets.filter(_ => [..._.rooms].includes(arg.room))
        // 如果房间满两个人让他们开始信令协商
        if (targetSocket.length === 2) {
            obj.start = true
        }
        cb(obj)

    })

    // 对等浏览器用于信令协商的接口
    socket.on('webrtc', async (arg) => {
        socket.to([...socket.rooms]).emit('webrtc', arg)
    })


});

httpServer.listen(8081);