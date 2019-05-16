import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';

const NNParallaxView = requireNativeComponent('NNParallaxView', ParallaxView);

export default class ParallaxView extends Component {

    render() {
        return (
            <NNParallaxView {...this.props} />
        );

    }
}