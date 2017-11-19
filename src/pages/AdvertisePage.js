import React, { Component } from 'react';
import {
    StyleSheet,
    ImageBackground,
} from 'react-native';


import { NavigationActions } from 'react-navigation';
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Login'})
    ]
});

class AdvertisePage extends Component {
    static navigationOptions = {
        title: 'Advertise',
        header:null,
        mode:"modal"
    };



    // this.props.navigation.dispatch(resetAction);
    componentDidMount(){
        const  {navigate}  = this.props.navigation;
        this.timer = setTimeout(function () {
                navigate('Login');
            }

            ,3000
        );
    }
    componentWillUnmount() {
        // 请注意Un"m"ount的m是小写

        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }
    render() {

        return(
            <ImageBackground source={{uri:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508760331630&di=a2c34ac8aa9fc8bac71a06dbdf23277e&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F018eda55442b1d0000019ae9648c40.jpg'}} style={{flex:1}}>
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

export default AdvertisePage;
