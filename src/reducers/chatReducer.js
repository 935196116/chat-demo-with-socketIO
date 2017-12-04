'use strict';


import  * as TYPE from '../constants/socketTypes';
import  '../componets/Storage';
const  initialState = {
    chatNrList: {
        kefu1:[
        ],
        xiaobai:[]

    },
    sendingList:{}
    ,
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
function save2History(_list) {
    storage.save({
        key: 'chatNrList',  // 注意:请不要在key中使用_下划线符号!
        data: _list,

        // 如果不指定过期时间，则会使用defaultExpires参数
        // 如果设为null，则永不过期
        expires: null
    });
}
function pushInList(data,list,who) {


    var  _list = deepClone(list);
    if(!_list[who])
    {
        _list[who] = [];

    }
    _list[who].unshift(data);
    // console.log(_list);
    save2History(_list);
    return _list;
}

export default  function chat(state=initialState,action){

    switch (action.type)
    {
        case TYPE.CONNECTING:

            return {
                ...state,
                socket:action.socket,
                chatNrList:action.chatNrList

            };
            break;

        case  TYPE.CONNECT_ERROR:
            alert("与服务器连接失败");
            return {
                ...state,
            };
            break;
        case TYPE.RECEIVE:
        {
            console.log(state);
            let mes = action.mes;
            let _list;
            if(action.mes.type===1)
                _list = pushInList(mes,state.chatNrList,mes.from);
                return {
                    ...state,
                    chatNrList:_list
                };


        }
            break;
        case TYPE.SEND:
            if(state.socket.disconnected)//判断是否断开了连接
            {
                state.socket.emit("serv_receive",{
                    type: HEADTBEAT,
                    nr: "",
                });
            }
            // console.log(state);
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

            if(action.mes.type===1)
                return {
                    ...state,
                    chatNrList:_list
                };
            else
                return {
                    ...state,
                };
            break;
        case TYPE.SENDING_IMG:
            mes = action.mes;

            state.sendingList[mes.guid]=0;
            _list = pushInList(mes,state.chatNrList,state.withWho);
            console.log(state);
            return {
                ...state,
                chatNrList:_list,
                sendingList:state.sendingList
            };

            break;
        case TYPE.PROGRESS:

            let t_sending = deepClone(state.sendingList);
            let per = action.per*100;
            if(per>0)
                 t_sending[action.guid] =  per-1+"%";
            console.log(t_sending[action.guid]);
            console.log(state.sendingList);
            return {
                ...state,
                sendingList:t_sending
            };

            break;
        default:
            return state;
    }



}