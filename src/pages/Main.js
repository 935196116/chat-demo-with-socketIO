import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux'; // 引入connect函数
import  *as socketAction from '../actions/socketAction';
import  '../componets/Storage';
import { NavigationActions } from 'react-navigation';

class Main extends Component {
    static navigationOptions = {
        title: 'Main',
        header:null,
        mode:"modal"
    };

    constructor(props)
    {
        super(props);





    }

    // this.props.navigation.dispatch(resetAction);
    componentDidMount(){
        this.props.connect(this.props.user);
        storage.save({
            key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
            data: this.props.user,

            // 如果不指定过期时间，则会使用defaultExpires参数
            // 如果设为null，则永不过期
            expires: 1000 * 3600
        });
        // 读取
        storage.load({
            key: 'loginState',

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
            alert("welcome: "+ret.name)
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
    componentWillUnmount() {

    }
    render() {

        return(
           <View style={styles.container}>
               <TouchableOpacity onPress={()=>{
                   this.props.navigation.navigate("Chat")}}>
                    <View style={styles.mainBtn}><Text>咨询客服</Text></View>
               </TouchableOpacity>
           </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    mainBtn:{
        width:200,
        height:90,
        backgroundColor:"skyblue",
        justifyContent:"center"
    },
    mainBtnText:{
        color:"#fff",
        fontSize:20,
    }

});
export default connect(
    (state) => ({
        user: state.loginIn.user,
    }),
    (dispatch) => ({
        connect: (user) => dispatch(socketAction.connect(user)),
    })
)(Main)
