'use strict';

import { combineReducers } from 'redux';
import loginIn from './loginReducer';
import chat from './chatReducer';

const rootReducer = combineReducers({
    loginIn: loginIn,
    chat:chat,
});

export default rootReducer;