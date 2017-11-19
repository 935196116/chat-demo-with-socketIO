import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';


import { NavigationActions } from 'react-navigation';

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Login'})
    ]
});
const right = "flex-end";
const left = "flex-start";
const txtMessage = (item)=>{

    return(
        <View style={[styles.txtBox,styles.scaleY,
            {
                justifyContent:item.who===1?left:right,


            }]}>

                 <Text style={[styles.txtNr,{ backgroundColor:item.who===1?"#fff":"rgb(163,299,100)"}]}>{item.content}</Text>

        </View>
    )
};



class ChatNrList extends Component {
    static navigationOptions = {
        title: '与客服一的聊天',
        mode:"modal"
    };
    constructor(props){
        super(props);
        this.state ={
            showZoom:false,
            selectedImg:{}
        }
    }
    imgMessage(item){


        //TODO:根据图像宽高数据缩放
        if(item.width>100)
        {
            var h =  100*item.height/item.width;
            var w = 100;
        }

        return(
            <View style={[styles.txtBox,styles.scaleY,
                {
                    justifyContent:item.who===1?left:right,


                }]}>
                <TouchableOpacity onPress={()=>{this.props.showZoom(item)}}>
                    <Image
                        source={{uri:item.url}}
                        style={{borderRadius:4,width:w,height:h,resizeMode:"cover"}}
                        resizeMethod="resize"
                    />
                </TouchableOpacity>
            </View>
        )
    }

    // this.props.navigation.dispatch(resetAction);
    componentDidMount(){


    }
    componentWillUnmount() {

    }

    _renderItem({item}){
        console.log(item);
        if(item.type === 1)
        {
            return(txtMessage(item));
        }
        else if(item.type === 2)
        {
            return(this.imgMessage(item));
        }
    }

    render() {

        return(
            <View style={styles.container}>
                <FlatList
                    data={this.props.data}
                    renderItem={this._renderItem.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        transform: [{ scaleY: -1 }],
    },
    scaleY:{
        transform: [{ scaleY: -1 }]
    },
    txtBox:{

        // backgroundColor:"yellowgreen",
        flex:1,
        flexDirection:"row",
        marginVertical:5,
        alignItems:"center",
        marginHorizontal:5
    },
    txtNr:{
        backgroundColor:"rgb(163,299,100)",
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:4,
        color:"#222",
        maxWidth:200,
        borderWidth:0.5,
        borderColor:"#aaa"

    }



});

export default ChatNrList;
