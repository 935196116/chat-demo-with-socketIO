import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux'; // 引入connect函数
import  *as socketAction from '../actions/socketAction';

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
