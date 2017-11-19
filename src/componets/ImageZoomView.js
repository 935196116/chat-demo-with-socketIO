import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Image,
    View,
    Modal,
    TouchableWithoutFeedback,

} from 'react-native';
// import Modal from 'react-native-modal'
import ImageZoom from 'react-native-image-pan-zoom';


class ImageZoomView extends Component {
    render() {


        if(this.props.height>Dimensions.get('window').height)
        {
            var height = this.props.width*(Dimensions.get('window').height-100)/Dimensions.get('window').width;
            var width = Dimensions.get('window').width;
        }
        else
        {
            var height = this.props.height;
            var width = this.props.width;
        }

        return(

            <Modal
                visible={this.props.isShow}
                animationType="slide"
                onRequestClose={()=>{}}

            >

                <View style={{flex:1,backgroundColor:"rgba(0,0,0,0.8)",justifyContent:"center",alignItems:"center"}}>
                <ImageZoom
                    onClick={()=>{this.props.onBackdropPress()}}
                            cropWidth={ Dimensions.get('window').width}
                           cropHeight={Dimensions.get('window').height}
                           imageWidth={width}
                           imageHeight={height}>
                    <Image style={{width:width,resizeMode:"contain", height:height}}
                           source={{uri:this.props.url}}
                           resizeMethod="resize"

                    />
                </ImageZoom>
                </View>

            </Modal>


        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',


    },


});

export {ImageZoomView as default};
