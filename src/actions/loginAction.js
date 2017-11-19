'use strict';

import * as TYPE from '../constants/loginTypes'; //导入事件类型，分配给各个事件

//模拟用户信息

let user = {
    name : 'xiaobai',
    pass : "753159"
};

//访问登录接口 根据返回结果划分action属于哪个type然后返回给对象，给reducer处理

export  function login() {
    console.log('login func');

    return dispatch =>{
        dispatch(isLogining());//正在登录
        //模拟用户登录
        // dispatch(loginSuccess(true,user));
        let result = fetch('https://www.baidu.com')
            .then((res)=>{
                dispatch(loginSuccess(true,user));
            }).catch((e)=>{
                dispatch(loginError(false))
            })
    }
}

function isLogining() {
    return {
        type:TYPE.LOGIN_DOING
    }
}
function loginSuccess(isSuccess,user) {
    return {
        type:TYPE.LOGIN_DONE,
        user:user
    }
}
function loginError(isSuccess) {
    return {
        type:TYPE.LOGIN_ERROR
    }
}