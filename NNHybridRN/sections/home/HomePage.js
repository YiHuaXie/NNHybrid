import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AppUtil from '../../utils/AppUtil';
import NavigationUtil from '../../utils/NavigationUtil';

export default class HomePage extends Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text
                    style={{ fontSize: 20, textAlign: 'center', margin: 10 }}
                    onPress={() => {
                        NavigationUtil.goPage("HouseDetailPage");
                    }}
                >
                    jump to HouseDetailPage
                </Text>
                <Text
                    style={{ fontSize: 20, textAlign: 'center', margin: 10 }}
                    onPress={() => {
                        NavigationUtil.goPage("CityListPage");
                    }}
                >
                    jump to CityListPage
                </Text>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppUtil.app_theme
    }
});