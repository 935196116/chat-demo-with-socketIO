'use strict';


import  * as TYPE from '../constants/socketTypes';
import  '../componets/Storage';

const  initialState = {
    chatNrList: {
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

    return _list;
}

export default  function chat(state=initialState,action){

    switch (action.type)
    {
        case TYPE.CONNECTING:
            if(state.chatNrList[state.withWho])
                return {
                    ...state,
                    socket:action.socket,
                };
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
            save2History(_list);
                return {
                    ...state,
                    chatNrList:_list
                };


        }
         break;
        case TYPE.SEND_DONE:
            {



                    let t_sending = deepClone(state.sendingList);
                    t_sending[action.mes.guid].per =  100;
                    console.log(t_sending);
                    //发送成功，删除发送列表中的对应记录

                    clearTimeout(t_sending[action.mes.guid].timer);
                    delete t_sending[action.mes.guid];
                     save2History(state.chatNrList);
                    return {
                        ...state,
                        sendingList:t_sending
                    };



            }


            break;
        case TYPE.SEND_ERROR:
        {



            let t_sending = deepClone(state.sendingList);
            t_sending[action.mes.guid].per =  -1000;
            // console.log(t_sending);

            let t_list = deepClone(state.chatNrList);
            let t_chatNr = t_list[state.withWho];

            for(let i = 0; i < t_chatNr.length ; i++)
            {
                if(t_chatNr[i].guid === action.mes.guid)
                {
                    t_chatNr[i].failed = true;
                    break;
                }
            }
            console.log(t_list);
            return {
                ...state,
                sendingList:t_sending,
                chatNrList:t_list
            };



        }


            break;
        case TYPE.SEND:


            let mes = action.mes;

            // if(action.mes.type===1)
            //      _list = pushInList(mes,state.chatNrList,state.withWho);
            let data = {
                toUid:state.withWho,
                mes:{
                    ...mes,
                    who:1,

                }
            };
            try{


                    let t_list=[];
                    if(action.mes.type === 1)
                    t_list   = pushInList(action.mes,state.chatNrList,state.withWho);
                    state.sendingList[mes.guid]={
                      per:0,
                      mes
                    };

                    console.log(mes);



                state.socket.emit("serv_receive",data,function () {

                    // action.dispatch({
                    //     type:TYPE.SEND_DONE,
                    //     mes:mes
                    // });
                    action.send_done(mes);

                });
                if(state.sendingList[mes.guid].timer)
                    clearTimeout(state.sendingList[mes.guid].timer);
                //30秒触发发送失败
                let t_id = setTimeout(function () {
                    action.send_error(mes);
                },30000);
                state.sendingList[mes.guid].timer = t_id;

                if(action.mes.type === 1)
                    return {
                        ...state,
                        chatNrList:t_list,
                        sendingList:state.sendingList
                    };

            }
            catch(e){
                alert("连接服务器失败!");
                console.log(e);
            }
                return {
                    ...state,
                };
            break;
        case TYPE.SENDING_IMG:
            {
                mes = action.mes;

                //90秒触发发送失败
                let t_id = setTimeout(function () {
                    action.send_error(mes);
                },90000);
                state.sendingList[mes.guid]={
                    per:0,
                    mes,
                    timer : t_id,
                };




                let _list = pushInList(mes,state.chatNrList,state.withWho);
                console.log(state);
                return {
                    ...state,
                    chatNrList:_list,
                    sendingList:state.sendingList
                };
            }


            break;
        case TYPE.PROGRESS:

            let t_sending = deepClone(state.sendingList);
            let per = action.per*100-1;
            if(per>0)
                 t_sending[action.guid].per =  per;
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