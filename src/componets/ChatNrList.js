import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    ProgressBarAndroid,
} from 'react-native';


const right = "flex-end";

const left = "flex-start";


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
    txtMessage(item){

        if(this.props.sendingList[item.guid]=== undefined || this.props.sendingList[item.guid].per===100 || item.who===1)
            return(
                <View style={[styles.txtBox,styles.scaleY,
                    {
                        justifyContent:item.who===1?left:right,


                    }]}>


                        <Text style={[styles.txtNr,{ backgroundColor:item.who===1?"#fff":"rgb(163,299,100)"}]}>{item.content}</Text>




                </View>
            );
        else if(this.props.sendingList[item.guid].per===-1000)
        {
            return(
                <View style={[styles.txtBox,styles.scaleY,
                    {
                        justifyContent:item.who===1?left:right,


                    }]}>
                    <Image source={require("../../img/send_failed.png")} style={{
                        width:18,height:18,marginHorizontal:5,
                    }} />
                    <Text style={[styles.txtNr,{ backgroundColor:item.who===1?"#fff":"rgb(163,299,100)"}]}>{item.content}</Text>




                </View>
            )
        }
        else
        {
            return(
                <View style={[styles.txtBox,styles.scaleY,
                    {
                        justifyContent:item.who===1?left:right,


                    }]}>
                    <ProgressBarAndroid styleAttr='Inverse' style={{height:16,width:16}}/>
                    <Text style={[styles.txtNr,{ backgroundColor:item.who===1?"#fff":"rgb(163,299,100)"}]}>{item.content}</Text>




                </View>
            )
        }
    };
    imgMessage(item){


        //TODO:根据图像宽高数据缩放
        if(item.width>100)
        {
            var h =  100*item.height/item.width;
            var w = 100;
        }
        if(this.props.sendingList[item.guid]===undefined)
        {
            return(
                <View style={[styles.txtBox,styles.scaleY,
                    {
                        justifyContent:item.who===1?left:right,


                    }]}>
                    <TouchableOpacity style={{position:"relative"}} onPress={()=>{this.props.showZoom(item)}}>

                        <Image source={{uri:item.url}}
                               style={[{resizeMode:"contain",width:w,height:h,borderRadius:8},styles.imgBox]}
                               resizeMethod="resize"/>



                    </TouchableOpacity>
                </View>
            )
        }
        else if(this.props.sendingList[item.guid].per>=-1)
        {
            let bgc = this.props.sendingList[item.guid].per!==100?"rgba(225,225,225,0.6)":"transparent";
            let opacity = this.props.sendingList[item.guid].per!==100?1:0;
            return(
                <View style={[styles.txtBox,styles.scaleY,
                    {
                        justifyContent:item.who===1?left:right,


                    }]}>
                    <TouchableOpacity style={{position:"relative",}} onPress={()=>{this.props.showZoom(item)}}>

                        <View style={[styles.imgBox]}>
                            <Image source={{uri:item.url}}
                                   style={{borderRadius:8,width:w,height:h,                                           resizeMode:"cover"}}
                                   resizeMethod="resize"/>
                            <View style={[styles.imgBox,{width:w,height:h,backgroundColor:bgc,opacity:opacity,position:"absolute",zIndex:10}]}>
                                <Text style={styles.imgProgress}>{this.props.sendingList[item.guid].per+"%"}</Text>
                            </View>

                        </View>
                        {/*<Image*/}
                        {/*source={{uri:item.url}}*/}
                        {/*style={{borderRadius:4,width:w,height:h,resizeMode:"cover"}}*/}
                        {/*resizeMethod="resize"*/}
                        {/*/>*/}
                    </TouchableOpacity>
                </View>
            )
        }
        else if(this.props.sendingList[item.guid] && this.props.sendingList[item.guid].per === -1000)
        {

                let bgc = this.props.sendingList[item.guid].per!==100?"rgba(225,225,225,0.6)":"transparent";
            let opacity = this.props.sendingList[item.guid].per!==100?1:0;
            return(
                <View style={[styles.txtBox,styles.scaleY,
                    {
                        justifyContent:item.who===1?left:right,


                    }]}>
                    <TouchableOpacity style={{position:"relative",}} onPress={()=>{this.props.showZoom(item)}}>

                        <View style={[styles.imgBox]}>
                            <Image source={{uri:item.url}}
                                   style={{borderRadius:8,width:w,height:h,                                           resizeMode:"cover"}}
                                   resizeMethod="resize"/>
                            <View style={[styles.imgBox,{width:w,height:h,backgroundColor:bgc,opacity:opacity},styles.imgBoxWrap]}>
                                <Image source={require("../../img/send_failed.png")} style={styles.imgProgressError}/>
                            </View>

                        </View>
                        {/*<Image*/}
                        {/*source={{uri:item.url}}*/}
                        {/*style={{borderRadius:4,width:w,height:h,resizeMode:"cover"}}*/}
                        {/*resizeMethod="resize"*/}
                        {/*/>*/}
                    </TouchableOpacity>
                </View>
            )
        }


    }

    // this.props.navigation.dispatch(resetAction);
    componentDidMount(){


    }
    componentWillUnmount() {

    }

    _renderItem({item}){
        // console.log(item);
        if(item.type === 1)
        {
            return(this.txtMessage(item));
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
                    extraData={this.props}
                    keyExtractor ={(item, index) => item.guid}
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
    }



});

export {ChatNrList as default};