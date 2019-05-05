import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppUtil from '../../utils/AppUtil';

export default class HouseDetailRecommendCell extends Component {
    render() {
        <View style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        color: AppUtil.app_black,
        fontWeight: '500',
    }
});