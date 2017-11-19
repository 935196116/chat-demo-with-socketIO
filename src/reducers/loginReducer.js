'use strict';


import  * as TYPE from '../constants/loginTypes';

const  initialState = {
    status:'点击登录',
    isSuccess:false,
    user:null
};

export default  function loginIn(state=initialState,action){

    switch (action.type)
    {
        case TYPE.LOGIN_DOING:
            return {
                status:'正在登录',
                isSuccess:false,
                user:null

            };
            break;

        case  TYPE.LOGIN_DONE:
            return {
                status:'登陆成功',
                isSuccess: true,
                user:action.user,
            };
            break;

        case TYPE.LOGIN_ERROR:
            return {
                status:'登录失败',
                isSuccess: false,
                user:null,
            };
            break;
        default:
            return state;
    }



}