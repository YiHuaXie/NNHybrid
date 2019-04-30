import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';

const ParallaxView = requireNativeComponent('ParallaxView', NNParallaxView);

export default class NNParallaxView extends Component {

    render() {
        return (
            <ParallaxView {...this.props} />
        );

    }
}