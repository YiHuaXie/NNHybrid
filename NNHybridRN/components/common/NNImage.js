import React, { Component } from 'react';
import { CachedImage } from 'react-native-img-cache';

export default class NNImage extends Component {

    render() {
        const { style, source } = this.props;
        return (
            <CachedImage style={{ ...style }} source={source} />
        );
    }
}