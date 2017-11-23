var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000);

const HEADTBEAT = 0;
const TXT = 1;
const IMG = 2;
var user = {};
console.log("server listening on 8000");
io.on('connection', function(socket) {
    console.log("new user wanna to connect");
    socket.emit('client_news', {
        mes: {
            type: HEADTBEAT,
            nr: "",
        }
    }, function(data) {
        console.log("sendEvent: " + data);
    });

    socket.on('serv_receive', function(data) {
        console.log(data);
        if (data.uid) {
            user[data.uid] = data.id;
        }
        console.log(data.toUid);
        if (data.toUid) {
            // console.log(socket.nsp.sockets[user[data.toUid]]);
            if (socket.nsp.sockets[user[data.toUid]]) {
                console.log("执行" + user[data.toUid]);
                socket.broadcast.to(user[data.toUid]).emit('client_news', data);
            } else {
                //TODO:将离线信息缓存到数据库中
                console.log("信息缓存");
            }

        }
    });

});
