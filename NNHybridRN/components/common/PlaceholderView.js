import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppUtil from '../../utils/AppUtil';

const ViewTypes = {
    SEARCHHOUSE: 'SearchHouse'
};

const reloadButton = () => {
    return (
        <TouchableOpacity onPress={() => { }}>
            <View style={styles.reloadButton}>
                <Text style={styles.reloadButtonText}>重新加载</Text>
            </View>
        </TouchableOpacity>
    );
}

export default class PlaceholderView extends Component {

    render() {
        <View>


        </View>
    }
}

const styles = StyleSheet.create({
    container: {

    },
    reloadButton: {
        width: 120,
        height: 30,
        backgroundColor: AppUtil.app_theme
    },
    reloadButtonText: {
        color: '#FFFFFF',
        fontSize: 13,

    }
});
