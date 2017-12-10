import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ProgressBarAndroid,
    TouchableHighlight,
    findNodeHandle,
    NativeModules

} from 'react-native';
// import Modal from 'react-native-modal'


const right = "flex-end";

const left = "flex-start";

class Message extends Component{

    constructor(props){
        super(props);
        // console.log(this.props);
    }


    renderImgMessage()
    {
        let item = this.props.data.item;
        let sendingItem = this.props.data.sendingItem;
        let h,w;
        //TODO:根据图像宽高数据缩放
        if(item.width>100)
        {
            h =  100*item.height/item.width;
            w = 100;
        }
        let showZoom =this.props.showZoom;
        function successImg()
        {
            return(
                <View style={[styles.txtBox,styles.scaleY,
                    {
                        justifyContent:item.who===1?left:right,


                    }]}>
                <TouchableOpacity style={{position:"relative"}} onPress={()=>{showZoom()}}>

                    <Image source={{uri:item.url}}
                           style={[{resizeMode:"contain",width:w,height:h,borderRadius:8},styles.imgBox]}
                           resizeMethod="resize"/>



                </TouchableOpacity>
                </View>
            )
        }

        function onprogress() {
            let bgc = sendingItem.per!==100?"rgba(225,225,225,0.6)":"transparent";
            let opacity = sendingItem.per!==100?1:0;
            return (
                <View style={[styles.txtBox,styles.scaleY,
                {
                    justifyContent:item.who===1?left:right,


                }]}>
                <TouchableOpacity style={{position:"relative",}} onPress={()=>{showZoom()}}>

                    <View style={[styles.imgBox]}>
                        <Image source={{uri:item.url}}
                               style={{borderRadius:8,width:w,height:h,                                           resizeMode:"cover"}}
                               resizeMethod="resize"/>
                        <View style={[styles.imgBox,{width:w,height:h,backgroundColor:bgc,opacity:opacity,position:"absolute",zIndex:10}]}>
                            <Text style={styles.imgProgress}>{sendingItem.per+"%"}</Text>
                        </View>

                    </View>

                </TouchableOpacity>
                </View>
            )
        }

        function failedImg() {
            let bgc = sendingItem.per!==100?"rgba(225,225,225,0.6)":"transparent";
            let opacity = sendingItem.per!==100?1:0;

            return (
                <View style={[styles.txtBox,styles.scaleY,
                    {
                        justifyContent:item.who===1?left:right,


                    }]}>
                <TouchableOpacity style={{position:"relative",}} onPress={()=>{showZoom()}}>

                    <View style={[styles.imgBox]}>
                        <Image source={{uri:item.url}}
                               style={{borderRadius:8,width:w,height:h,                                           resizeMode:"cover"}}
                               resizeMethod="resize"/>
                        <View style={[styles.imgBox,{width:w,height:h,backgroundColor:bgc,opacity:opacity},styles.imgBoxWrap]}>
                            <Image source={require("../../img/send_failed.png")} style={styles.imgProgressError}/>
                        </View>

                    </View>

                </TouchableOpacity>
                  </View>
            )
        }


        if(sendingItem === undefined &&  !item.failed)
          return successImg();
        else if(sendingItem.per >= -1)
        {
            return onprogress()
        }
        else
        {
            return failedImg()
        }
    }

    renderTextMessage(){
        let item = this.props.data.item;
        let sendingItem = this.props.data.sendingItem;

        function successMessage() {
            return (

                <View style={[styles.txtBox,styles.scaleY,
                    {
                        justifyContent:item.who===1?left:right,
                        position:"relative",

                    }]}>






                    <TouchableHighlight
                        style={{borderRadius:5}}
                        underlayColor="rgba(0,0,0,0.6)"
                        onLongPress={({nativeEvent})=>{
                            NativeModules.UIManager.measure(nativeEvent.target, (x, y, width, height, pageX, pageY) => {

                                        this.props.setCopyBtn(pageX,pageY,this.props.data.item.content,width);

                                    });
                        }}>
                        <View

                            style={{alignItems:"center"}}>


                            <Text style={[styles.txtNr,{ backgroundColor:item.who===1?"#fff":"rgb(163,299,100)"}]}>{item.content}</Text>


                        </View>

                    </TouchableHighlight>
                </View>



            )
        }
        function failedText() {
            return (

                    <View style={[styles.txtBox,styles.scaleY,
                        {
                            justifyContent:item.who===1?left:right,


                        }]}>

                        <Image source={require("../../img/send_failed.png")} style={{
                            width:18,height:18,marginHorizontal:5,
                        }} />

                        <TouchableHighlight
                            style={{borderRadius:5}}
                            underlayColor="rgba(0,0,0,0.6)"
                            onLongPress={({nativeEvent})=>{
                                NativeModules.UIManager.measure(nativeEvent.target, (x, y, width, height, pageX, pageY) => {

                                    this.props.setCopyBtn(pageX,pageY,this.props.data.item.content,width);

                                });
                            }}>
                            <Text selectable={true} style={[styles.txtNr,{ backgroundColor:item.who===1?"#fff":"rgb(163,299,100)"}]}>{item.content}</Text>
                        </TouchableHighlight>
                    </View>





            )
        }
        function onprogress() {
            return (


                    <View style={[styles.txtBox,styles.scaleY,
                        {
                            justifyContent:item.who===1?left:right,


                        }]}>
                        <ProgressBarAndroid styleAttr='Inverse' style={{height:16,width:16,marginHorizontal:5}}/>
                        <TouchableHighlight
                            style={{borderRadius:5}}
                            underlayColor="rgba(0,0,0,0.6)"
                            onLongPress={({nativeEvent})=>{
                                NativeModules.UIManager.measure(nativeEvent.target, (x, y, width, height, pageX, pageY) => {

                                    this.props.setCopyBtn(pageX,pageY,this.props.data.item.content,width);

                                });
                            }}>
                            <Text selectable={true} style={[styles.txtNr,{ backgroundColor:item.who===1?"#fff":"rgb(163,299,100)"}]}>{item.content}</Text>
                        </TouchableHighlight>
                    </View>



            )
        }

        if(!item.failed && sendingItem=== undefined || sendingItem===100 || item.who===1)
        {
            return  successMessage.bind(this)();
        }
        else if(item.failed || sendingItem.per===-1000)
        {
            return  failedText.bind(this)();
        }
        else
        {
            return  onprogress.bind(this)();
        }



    }

    _renderItem(){
        let item = this.props.data.item;
        if(item.type === 2)
            return this.renderImgMessage();
        else if(item.type === 1)
            return this.renderTextMessage();
    }


    render  (){

        return (this._renderItem())

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
        marginVertical:8,
        alignItems:"center",
        marginHorizontal:5
    },
    imgBoxWrap:{
        position:"absolute",zIndex:10,
        justifyContent:"center"
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

    },
    imgBox:{
        flexDirection:"row",
        alignItems:"center",
        borderRadius:8,

    },
    imgProgressError:{
        width:20,
        height:20,

    },
    imgProgress:{
        flex:1,
        textAlign:"center",
        color:"#666"
    },




});

export {Message as default};
