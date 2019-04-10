import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AppUtil from '../../utils/AppUtil';

// import deviceInfo from '../deviceInfo'

export default class ProgressHUD extends Component {

    // componentWillReceiveProps(nextProps) {
    //     if (!nextProps.showHUD) {
    //         Actions.pop({ loading: true })
    //     }
    // }

    render() {
        return (
            <View style={styles.maskStyle}>
                <View style={styles.backViewStyle}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    maskStyle: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: AppUtil.windowWidth,
        height: AppUtil.windowHeight,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backViewStyle: {
        backgroundColor: '#111111',
        width: 120,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    }
});