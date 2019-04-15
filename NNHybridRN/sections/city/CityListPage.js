import React, { Component } from 'react';
import { View, Text } from 'react-native';
import NavigationBar from '../../navigator/NavigationBar';

export default class CityListPage extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <Text
                    style={{ fontSize: 20, textAlign: 'center', margin: 10 }}
                    onPress={() => {
                    }}
                >
                    CityListPage
                </Text>
                <NavigationBar
                    backOrClose='close'
                    title='选择城市'
                    navBarStyle={{
                        position: 'absolute',
                    }}
                />
            </View>
        );
    }
}