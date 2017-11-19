import * as SERVER from '../constants/serverAddr'; //导入事件类型，分配给各个事件
import io from 'socket.io-client';

import  * as TYPE from '../constants/socketTypes';

export function connect(user) {


    return dispatch=>{
        var socket = io(SERVER.SERVER_ADDR);
        socket.on("client_news",function (data) {
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