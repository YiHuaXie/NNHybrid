import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';

const MapLocationView = requireNativeComponent('MapLocationView', NNMapLocationView);

export default class NNMapLocationView extends Component {

    render() {
        return (
            <MapLocationView {...this.props} />
        );
    }
}
