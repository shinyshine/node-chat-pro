const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

let usersNum = 0;
const users = [];


server.listen(3000, () => {
    console.log('server running 3000')
})

app.get('/',(req,res)=>{
    // res.redirect('/index.html');
    res.sendFile(__dirname + '/static/index.html');
});


app.use('/',express.static(path.join(__dirname,'./static')));


// 有人加入聊天室
io.on('connection', function(socket) {

    usersNum ++;
    console.log(`当前有${usersNum}个用户连接上服务器了`); 

    socket.on('login', ({ username }) => {
        users.push({
            username,
            message: []
        })

        socket.emit('loginSuccess', username)
    })


    // 断开连接之后
    socket.on('disconnect',()=>{     
        usersNum --;  
        console.log(`当前有${usersNum}个用户连接上服务器了`);  
    })  

    // 监听客户端发送信息
    socket.on('sendMessage', (data) => {
        for(let user of users) {
            if(user.username === data.username) {
                user.message.push(data.message);

                io.emit('receiveMessage', data);

                break;
            }
        }
    })
})





