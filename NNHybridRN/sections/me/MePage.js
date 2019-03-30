import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class HomePage extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#123555' }}>
                <Text>我的页面</Text>
            </View>
        );
    }
}