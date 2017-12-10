import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableHighlight,
    Text,
    Clipboard
} from 'react-native';

import Message from "./Message";
import Modal from 'react-native-modal';
import ImageZoomView from '../componets/ImageZoomView'
import SelectPic from '../componets/SelectPic'

class ChatNrList extends Component {
    static navigationOptions = {
        title: '与客服一的聊天',
        mode:"modal"
    };
    constructor(props){
        super(props);
        this.state ={
            showZoom:false,
            selectedImg:{},

        }
    }
    setCopyBtn(posX,posY,selectedText,width){

        this.setState({
            posX:posX+width/2-20,
            posY:posY-20,
            selectedText,
            showCopy:true,
        });

    }
    hideCopyBtn(){
        this.setState({showCopy:false});
    }


    showZoom(item) {

        this.setState({
            showZoom:true,
            selectedImg:item
        })
    }


    _renderItem({item}){
        let data = {
            item,
            sendingItem:this.props.sendingList[item.guid]
        };

        return (
                <Message
                    data={data}
                    setCopyBtn = {this.setCopyBtn.bind(this)}
                    hideCopyBtn = {this.hideCopyBtn.bind(this)}
                    showZoom={()=>{
                        this.showZoom(item)}}
                />
                )
    }
    async _setClipboardContent(){
        Clipboard.setString(this.state.selectedText);
        this.hideCopyBtn();
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
                <Modal
                    style={styles.copyView}
                    isVisible={this.state.showCopy}
                    backdropColor="transparent"
                    onBackdropPress={()=>{this.hideCopyBtn()}}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    useNativeDriver={true}
                    animationInTiming={100}
                    animationOutTiming={100}
                >
                    <TouchableHighlight
                        onPress={()=>{
                            this._setClipboardContent();

                        }}
                        style={[styles.copy,{
                            left:this.state.posX,
                            top:this.state.posY
                        }]}>
                        <View style={styles.copyBtn}>
                            <Text style={styles.copyBtnText}>
                                复制
                            </Text>
                            <View style={styles.triangle} />
                        </View>

                    </TouchableHighlight>
                </Modal>

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
        transform: [{ scaleY: -1 }],
        position:"relative"
    },
    copyView:{
        flex:1,

        position:"relative"
    },
    copy:{
        borderRadius:5,
        position:"absolute",
        zIndex:10,
        width:40
    },
    copyBtn:{

        position:"relative",
        paddingBottom:6,

    },
    copyBtnText:{
        fontSize:12,
        width:40,
        paddingVertical:6,
        paddingHorizontal:3,
        borderRadius:5,
        textAlign:"center",
        color:"#fff",
        backgroundColor:"rgba(0,0,0,0.8)",
    },
    triangle:{
        borderWidth:5,
        borderColor:"rgba(0,0,0,0)",
        borderTopColor:"rgba(0,0,0,0.8)",
        width:7,
        height:7,
        position:"absolute",
        bottom:-4,
        left:15
    }

});

export {ChatNrList as default};