import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';
import AppUtil from '../../utils/AppUtil';

const PlaneLoading = requireNativeComponent('PlaneLoading', NNPlaneLoading);

export default class NNPlaneLoading extends Component {

    render() {
        return (
            this.props.show ?
                <PlaneLoading {...this.props}
                    style={{
                        position: 'absolute',
                        width: AppUtil.windowWidth,
                        height: AppUtil.windowHeight
                    }}
                /> : null
        );
    }
}
