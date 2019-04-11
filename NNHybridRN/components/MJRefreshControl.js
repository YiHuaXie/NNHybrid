import React, { Component } from 'react';
import {
    requireNativeComponent,
    NativeModules,
} from 'react-native';

const mjRefreshControl = requireNativeComponent('MJRefreshControl', MJRefreshControl);
// const RefreshControlManager = NativeModules.RefreshControlManager;

export default class MJRefreshControl extends Component {
    render() {
        return (
            <mjRefreshControl/>
        );
    }
}