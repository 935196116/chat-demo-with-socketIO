import  React,{Component} from 'react';

import {StackNavigator} from  'react-navigation';

import LoginPage from '../pages/LoginPage';
import AdvertisePage from '../pages/AdvertisePage';
import MainPage from '../pages/Main';
import  ChatPage from '../pages/ChatPage';
const App = StackNavigator({
    Advertise:{screen:AdvertisePage},
    Login:{screen:LoginPage},
    Main:{screen:MainPage},
    Chat:{screen:ChatPage},

});

export  default  App;