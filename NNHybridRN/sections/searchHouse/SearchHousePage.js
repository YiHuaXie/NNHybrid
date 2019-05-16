import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import NavigationBar from '../../navigator/NavigationBar';
import NavigationUtil from '../../utils/NavigationUtil';

export default class SearchHousePage extends Component {

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    backOrCloseHandler={() => NavigationUtil.goBack()}
                    title='搜房'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
});
