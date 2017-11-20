import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Button,
    NativeModules
} from 'react-native';
import { connect } from 'react-redux'; // 引入connect函数
import  *as socketAction from '../actions/socketAction';
import { NavigationActions } from 'react-navigation';
import ChatNrList from '../componets/ChatNrList';
import AutoGrowingTextInputFixed from '../componets/TextInputAutoGrow';
const ImagePicker = NativeModules.ImageCropPicker;
import ImageZoomView from '../componets/ImageZoomView'
import TencentOSS from '../componets/TencentOSS'
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Login'})
    ]
});

class ChatPage extends Component {
    static navigationOptions = {
        title: '与客服一的聊天',
        mode:"modal",

    };

    constructor(props){
        super(props);
        this.state = {
            nr:"",
            showZoom:false,

            selectedImg:{
            },
            sending:[]
        }


    }

    // this.props.navigation.dispatch(resetAction);
    componentDidMount(){


    }
    showZoom(item) {
        this.setState({
            showZoom:true,
            selectedImg:item
        })
    }
    _sendTxt(){
        let mes = {
            content:this.state.nr,
            type:1,
            who:2,
        };
        this.props.send(mes);
        this.setState({
            nr:""
        })
    }
    _send_img(img,guid){
        let mes = {
            url:img.path,
            type:2,
            who:2,
            width:img.width,height:img.height,
            guid
        };
        this.props.send_img(mes);
    }
    _pickSingleWithCamera(){
        ImagePicker.openCamera({
            cropping: false,
            width: 500,
            height: 500,
            includeExif: true,
            compressImageQuality:0.7
        }).then(image => {
            console.log('received image', image);
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height},
                images: null
            });
            console.log(image);
            TencentOSS.getAppsign(TencentOSS.upLoad,"/g.jpg",image);
        }).catch(e => alert(e));
    }
    _pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            // compressImageQuality:0.7
        }).then(images => {
                images.map((i,idx) => {
                    console.log('received image', i);
                    let guid = TencentOSS.guid();
                    this._send_img(i,guid);

                    // TencentOSS.getAppsign(TencentOSS.upLoad,"/g.jpg",i);
                    TencentOSS.getAppsign().then(key=>{

                        TencentOSS.upLoad(key,i,guid,(per)=>{this.props.onprogress(guid,per)})
                            .then(
                                response=>{
                                    response = JSON.parse( response);
                                    if(response.code ===0)
                                    {
                                        console.log("success upload");
                                    }
                                    else
                                    {
                                        alert("上传失败,请重新选择");
                                    }
                                }
                            )

                    }).catch( e=> alert(e));
                    return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
                })

        }).catch(e => alert(e));
    }

    render() {
        // console.log(this.props.chatNrList);
        return(
            <View style={styles.container}>
                {/*消息列表*/}
                <ChatNrList
                    data={this.props.chatNrList.kefu1}
                    showZoom={this.showZoom.bind(this)}
                />
                {/*输入区域*/}
                <View style={{alignItems:"flex-end",backgroundColor:"#fff",flexDirection:"row"}}>
                    {/*文字输入*/}
                    <AutoGrowingTextInputFixed
                      style={styles.textInput}
                      placeholder="请输入聊天内容"
                      placeholderTextColor="#aaa"
                      value={this.state.nr}
                      onChangeText={(text) => this.setState({nr:text})}
                    />
                    {/*发送按钮*/}
                    <TouchableOpacity style={styles.sendBtn} onPress={()=>{this._sendTxt();}}>
                        <Text style={{fontSize:16,color:"#fff"}}>发送</Text>
                    </TouchableOpacity>
                    {/*选择图片/相机*/}
                    <TouchableOpacity onPress={()=>{this._pickMultiple()}}>
                        <Image
                            source={require("../../img/add.png")}
                            style={{width:28,height:28,marginBottom:4}}
                        />
                    </TouchableOpacity>

                </View>
                <ImageZoomView
                    url={this.state.selectedImg.url}
                    width={this.state.selectedImg.width}
                    height={this.state.selectedImg.height}
                    isShow={this.state.showZoom}
                    onBackdropPress={()=>{this.setState({showZoom:false})}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

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
    },
    textInput:{
        flex:1,
        height:25,
        fontSize:18,
        paddingHorizontal:8
    },
    sendBtn:{
        backgroundColor:"skyblue",
        padding:4,
        paddingHorizontal:20,
        justifyContent:"center",
        borderRadius:6,
        marginBottom:4


    }


});

export default connect(
    (state) => ({
        user: state.loginIn.user,
        chatNrList:state.chat.chatNrList

    }),
    (dispatch) => ({
        connect: (user) => dispatch(socketAction.connect(user)),
        send: (mes) => dispatch(socketAction.send(mes)),
        send_img:(mes) => dispatch(socketAction.send_img(mes)),
        onprogress:(guid,per) => dispatch(socketAction.onprogress(guid,per))
    })
)(ChatPage)
