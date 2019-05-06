import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppUtil from '../../utils/AppUtil';

export default class HouseDetailSectionHeader extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: 'yellow',
        // alignItems: 'center',
    },
    title: {
        fontSize: 15,
        color: AppUtil.app_black,
        fontWeight: '500',
    }
});