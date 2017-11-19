import React, {Component} from 'react'
import {Platform} from 'react-native'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput'

export default class AutoGrowingTextInputFixed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            height: 0,
        }
        this.forceResize = this.forceResize.bind(this)
    }

    forceResize(event) {
        const {nativeEvent} = event
        if (
            Platform.OS !== 'ios' &&
            nativeEvent &&
            nativeEvent.contentSize &&
            nativeEvent.contentSize.height !== this.height
        ) {
            this.height = event.nativeEvent.height
            this.input._handleNativeEvent(nativeEvent)
        }
    }

    render() {
        return (
            <AutoGrowingTextInput
                {...this.props}
                onContentSizeChange={this.forceResize}
                ref={ref => (this.input = ref)}
            />
        )
    }
}