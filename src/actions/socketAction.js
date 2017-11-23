import * as SERVER from '../constants/serverAddr'; //导入事件类型，分配给各个事件
import io from 'socket.io-client';

import  * as TYPE from '../constants/socketTypes';

export function connect(user) {


    return dispatch=>{
        //修复只能在debug模式下才可以正常运行，问题应该是debug模式下可以通过websocket进行连接，
        //但是取消了debug模式，就无法通过websocket进行连接了,另外附上服务端代码
        var socket = io("ws://"+SERVER.SERVER_ADDR,{
            transports: ['websocket'],
        });
       console.log(socket);
        socket.on("client_news",function (data) {
            console.log("收到:"+data);
            if(data.mes.type === 0)
            {
                let d = {
                    uid:user.name,
                    id:socket.id
                };
                socket.emit("serv_receive",d);
                if(!socket.disconnected)
                    dispatch({
                        socket:socket,
                        type:TYPE.CONNECTING
                    });
                else
                    dispatch({
                        socket:socket,
                        type:TYPE.CONNECT_ERROR
                    })
            }
            else
            {
                dispatch({
                    type:TYPE.RECEIVE,
                    mes:data.mes
                })
            }

        })
    }

}

export function send(mes) {
    return dispatch=>{
        dispatch({
            type:TYPE.SEND,
            mes:mes
        })
    }
}
export function send_img(mes) {
    return dispatch=>{
        dispatch({
            type:TYPE.SENDING_IMG,
            mes:mes
        })
    }
}
export function onprogress(guid,per) {
    return dispatch=>{
        dispatch({
            type:TYPE.PROGRESS,
            guid,
            per
        })
    }
}