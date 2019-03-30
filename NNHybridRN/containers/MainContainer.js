import React, { Component } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { BottomTabBar } from 'react-navigation-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import HomePage from '../sections/home/HomePage';
import MePage from '../sections/me/MePage';

const TabRouteConfigs = {
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            tabBarLabel: "首页",
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons name={'md-trending-up'} size={26} style={{ color: tintColor }} />
            )
        },
    },
    MePage: {
        screen: MePage,
        navigationOptions: {
            tabBarLabel: "我的",
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons name={'md-trending-up'} size={26} style={{ color: tintColor }} />
            )
        }
    }
};

export class AppTabNavigator extends Component {

    _tabNavigator() {
        if (!this.tabBar) {
            this.tabBar = createAppContainer(createBottomTabNavigator(TabRouteConfigs, {
                tabBarComponent: props => <BottomTabBar {...props} />
            }));
        }

        return this.tabBar;
    }

    render() {
        const TabBar = this._tabNavigator();
        return <TabBar />
    }
}

/**
 * 相当于TabBarController
 */
export default class MainContainer extends Component {

    render() {
        return (
            <View style={{ flex: 1 }}>
                <AppTabNavigator />
            </View>
        );
    }
}


