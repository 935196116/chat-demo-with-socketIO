import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TextInput,
} from 'react-native';

import { connect } from 'react-redux'; // 引入connect函数
import *as loginAction from '../actions/loginAction';// 导入action方法
import { NavigationActions } from 'react-navigation';

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Main'})
    ]
});

class LoginPage extends Component {
    static navigationOptions = {
        title: 'LoginPage',
        header:null,
        mode:"modal"

    };

    shouldComponentUpdate(nextProps, nextState) {
        // 登录完成,切成功登录
        if (nextProps.status === '登陆成功' && nextProps.isSuccess) {
            this.props.navigation.dispatch(resetAction);
            return true;
        }
        return true;
    }

    render() {
        console.log(this.props);
        const { login } = this.props;
        return(
            <ImageBackground source={require('../../img/login.jpg')} style={{flex:1}}>
            <View style={styles.container}>



                <View style={styles.loginForm}>
                    <TextInput style={styles.text} underlineColorAndroid="transparent" placeholder="输入账号" placeholderTextColor="#aaa"/>
                    <TextInput style={styles.text} underlineColorAndroid="transparent" placeholder="输入密码" placeholderTextColor="#aaa"/>
                    {/*登录按钮*/}
                    <TouchableOpacity onPress={()=>login()} style={{marginTop: 50}}>
                        <View style={styles.loginBtn}>
                            <Text style={{color:"#fff"}}>{this.props.status}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'rgba(0,0,0,0.3)'

    },
    loginForm:{
        width:200,

    },
    loginBtn: {
        borderWidth: 1,
        padding: 5,
        width: 190,
        alignItems:'center',
        borderColor:"#fff"

    },
    text:{
        fontSize:18,
        marginRight:15,
        color:"#fff",
        borderColor:'#fff',
        borderBottomWidth: 1,
        marginBottom:10,
        padding: 0,
        paddingLeft:5
        // underlineColorAndroid:"transparent",

    },
});

export default connect(
    (state) => ({
        status: state.loginIn.status,
        isSuccess: state.loginIn.isSuccess,
        user: state.loginIn.user,
    }),
    (dispatch) => ({
        login: () => dispatch(loginAction.login()),
    })
)(LoginPage)