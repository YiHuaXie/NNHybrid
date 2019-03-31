import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationUtil from '../utils/NavigationUtil';

export default class StartContainer extends Component {

    componentDidMount() {
        this.timer = setTimeout(() => {
            NavigationUtil.jumpToMain();
        }, 2000);
    }

    componentWillMount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        NavigationUtil.navigation = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>WelcomePage</Text>
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
