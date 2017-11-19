'use strict';


import  * as TYPE from '../constants/socketTypes';

const  initialState = {
    chatNrList: {
        kefu1:[
            {
                content:"你好小白1你好小白1你好小白1你好小白1你好小白1",
                type:1,
                who:1,
            },
            {
                content:"你好小白2",
                type:1,
                who:2,
            },
            {
                url:"http://192.168.1.102/www/1.jpg",
                type:2,
                who:2,
                width:3120,height:4160,
            }

        ],

    },
    socket:{},
    withWho:"kefu1",
};
//深度克隆
function deepClone(obj){
    var newObj= obj instanceof Array?[]:{};
    for(var i in obj){
        newObj[i]=typeof obj[i]=='object'?
            deepClone(obj[i]):obj[i];
    }
    return newObj;
}
function pushInList(data,list,who) {


    var  _list = deepClone(list);
    _list[who].unshift(data);
    console.log(_list);

    return _list;
}
export default  function chat(state=initialState,action){

    switch (action.type)
    {
        case TYPE.CONNECTING:
            return {
                ...state,
                socket:action.socket,

            };
            break;

        case  TYPE.CONNECT_ERROR:
            alert("与服务器连接失败");
            return {
                ...state,
            };
            break;

        case TYPE.SEND:
            console.log(state);
            let mes = action.mes;
            let _list;
            if(action.mes.type===1)
                 _list = pushInList(mes,state.chatNrList,state.withWho);
            let data = {
                toUid:state.withWho,
                mes:{
                    ...mes,
                    who:1
                }
            };
            state.socket.emit("serv_receive",data);
            return {
                ...state,
                chatNrList:_list
            };
            break;
        case TYPE.SENDING_IMG:
            mes = action.mes;
            _list = pushInList(mes,state.chatNrList,state.withWho);
            return {
                ...state,
                chatNrList:_list
            };
            break;
        default:
            return state;
    }



}