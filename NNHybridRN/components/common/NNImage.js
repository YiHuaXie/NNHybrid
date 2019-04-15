import React, { Component } from 'react';
import { View } from 'react-native';
import { CachedImage } from 'react-native-img-cache';

export default class NNImage extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     showDefault: true,
        // }
    }

    render() {
        const { source, style } = this.props;
        return (
            <CachedImage style={{ ...style }} source={source} />
            // this.state.showDefault
            //     ? <View>
            //         <CachedImage style={{ ...style }} source={require('../../../static/images/bg_light.png')} resizeMode='cover' />
            //         <CachedImage style={{ width: 1, height: 1 }} source={source} onLoadStart={() => this.setState({ showDefault: true })} onLoad={() => this.setState({ showDefault: false })} />
            //     </View>
            //     : <CachedImage style={{ ...style }} source={source} />
        );
    }
}