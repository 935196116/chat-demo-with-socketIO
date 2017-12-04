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
                {
                    getHistoryData((list)=>{

                        dispatch({
                            socket:socket,
                            chatNrList:list,
                            type:TYPE.CONNECTING
                        });
                    });

                }
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
function getHistoryData(connect) {
    storage.load({
        key: 'chatNrList',

        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
        autoSync: true,

        // syncInBackground(默认为true)意味着如果数据过期，
        // 在调用sync方法的同时先返回已经过期的数据。
        // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
        syncInBackground: true,

        // 你还可以给sync方法传递额外的参数
        syncParams: {
            extraFetchOptions: {
                // 各种参数
            },
            someFlag: true,
        },
    }).then(ret => {
        // 如果找到数据，则在then方法中返回
        // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
        // 你只能在then这个方法内继续处理ret数据
        // 而不能在then以外处理
        // 也没有办法“变成”同步返回
        // 你也可以使用“看似”同步的async/await语法

        connect(ret);
        // console.log(ret.name);

    }).catch(err => {
        //如果没有找到数据且没有sync方法，
        //或者有其他异常，则在catch中返回
        console.warn(err.message);
        switch (err.name) {
            case 'NotFoundError':
                // TODO;
                break;
            case 'ExpiredError':
                // TODO
                break;
        }
    })
}