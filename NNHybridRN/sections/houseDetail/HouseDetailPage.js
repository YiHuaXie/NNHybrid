import React, { Component } from 'react';
import { View, Text } from 'react-native';
import NavigationUtil from '../../utils/NavigationUtil';

export default class HouseDetailPage extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <Text
                    style={{ fontSize: 20, textAlign: 'center', margin: 10 }}
                    onPress={() => {
                        NavigationUtil.goPage('CityListPage');
                    }}>
                    HouseDetailPage
                </Text>
            </View>
        );
    }
}