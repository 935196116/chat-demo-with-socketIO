import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    NativeModules,
    TouchableHighlight,
    Text,
} from 'react-native';
import Modal from 'react-native-modal'
import TencentOSS from '../componets/TencentOSS'
const ImagePicker = NativeModules.ImageCropPicker;
/*
   props:
         _hideModal
         isModalVisible
         _sendingImg //加入发送队列
         send       //发送图片地址信息
         onprogress //进度

*/
class SelectPic extends Component {

    _upload(i){

        let guid = TencentOSS.guid();
        this.props._sendingImg(i,guid);

        TencentOSS.getAppsign().then(key=>{

            TencentOSS.upLoad(key,i,guid,(per)=>{this.props.onprogress(guid,per)})
                .then(
                    response=>{
                        response = JSON.parse( response);
                        if(response.code ===0)
                        {
                            //发送图片地址给另一端
                            let mes =   {
                                url:response.data.access_url,
                                type:2,
                                who:1,
                                guid
                            };
                            this.props.send(mes);
                            // this.props.onprogress(guid,1.01);
                            console.log(response.access_url);
                            console.log("success upload");

                        }
                        else
                        {
                            alert("上传失败,请重新选择");
                        }
                    }
                )

        }).catch( e=> alert(e));

    }
    _pickSingleWithCamera(){
        this.props._hideModal();
        ImagePicker.openCamera({
            cropping: false,
            width: 500,
            height: 500,
            includeExif: true,
            compressImageQuality:0.8
        }).then(image => {

            console.log('received image', image);
            //上传
            this._upload(image);

            console.log(image);
        }).catch(e => alert(e));
    }
    _pickMultiple() {
        this.props._hideModal();
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            compressImageQuality:0.7
        }).then(images => {

            images.map((i,idx) => {
                console.log('received image', i);

                //上传
                this._upload(i);

                return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
            })

        }).catch(e => alert(e));
    }
    render(){
        return(
            <Modal isVisible={this.props.isModalVisible}
                   style={styles.bottomModal}
                   onBackdropPress={()=>{this.props._hideModal()}}
                   useNativeDriver={true}
            >
                <View style={{backgroundColor:"rgb(210,210,210)"}}>
                    <TouchableHighlight
                        onPress={()=>{this._pickMultiple();}}
                        style={styles.picBtn}>
                        <Text style={{color:"#333"}}>选择图片</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.picBtn} onPress={()=>{this._pickSingleWithCamera()}}>
                        <Text style={{color:"#333"}}>拍照</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.picBtn,{marginTop:5}]} onPress={()=>{this._hideModal()}}>
                        <Text style={{color:"#333"}}>取消</Text>
                    </TouchableHighlight>
                </View>
            </Modal>


        )
    }

}

const styles = StyleSheet.create({

    picBtn:{

        alignItems:"center",
        justifyContent:"center",
        height:40,
        backgroundColor:"rgb(242,242,242)",
        marginTop:0.5
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },


});

export {SelectPic as default};
