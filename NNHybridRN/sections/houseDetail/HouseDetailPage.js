import React, { Component } from 'react';
import { StyleSheet,View, Text, SectionList } from 'react-native';
import NavigationUtil from '../../utils/NavigationUtil';
import HouseDetailBannerCell from './HouseDetailBannerCell';

export default class HouseDetailPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>HouseDetailPage</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});