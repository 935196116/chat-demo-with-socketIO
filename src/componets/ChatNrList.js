import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
} from 'react-native';

import Message from "./Message";

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


    _renderItem({item}){
        let data = {
            item,
            sendingItem:this.props.sendingList[item.guid]
        };

        return (
                <Message
                    data={data}
                    showZoom={()=>{
                        console.log(item);
                        this.props.showZoom(item)}}
                />
                )
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
});

export {ChatNrList as default};