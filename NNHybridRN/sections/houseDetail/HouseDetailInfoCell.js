import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class HouseDetailInfoCell extends Component {

    render() {
        return (
            <View style={styles.container}>
            <Text style={styles.title}></Text>
            {/* 标签排布试图 */}          
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    title: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',  
    }
})