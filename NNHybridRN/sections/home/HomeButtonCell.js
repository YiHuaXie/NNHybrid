import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import AppUtil from '../../utils/AppUtil';

export default class HomeButtonCell extends Component {

    render() {
        return (
            <View style={styles.container} >
                <TouchableWithoutFeedback>
                    <View style={styles.button}>
                        <Text style={styles.title}>查看更多房源</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 115,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        height: 45,
        width: AppUtil.windowWidth - 30,
        borderWidth: 1,
        borderColor: AppUtil.app_gray,
        borderRadius: 4,
        justifyContent: 'center'
    },
    title: {
        color: AppUtil.app_gray,
        fontSize: 14,
        textAlign: 'center'
    }
});