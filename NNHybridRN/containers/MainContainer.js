import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { BottomTabBar } from 'react-navigation-tabs';
import AppUtil from '../utils/AppUtil';
import HomePage from '../sections/home/HomePage';
import MePage from '../sections/me/MePage';
import NavigationUtil from '../utils/NavigationUtil';

const TabRouteConfigs = {
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            tabBarLabel: "首页",
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    activeIcon={require('../resource/images/tabbar/tab_bar_home_selected.png')}
                    inactiveIcon={require('../resource/images/tabbar/tab_bar_home_normal.png')}
                />
            )
        },
    },
    MePage: {
        screen: MePage,
        navigationOptions: {
            tabBarLabel: "我的",
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    activeIcon={require('../resource/images/tabbar/tab_bar_me_selected.png')}
                    inactiveIcon={require('../resource/images/tabbar/tab_bar_me_normal.png')}
                />
            )
        }
    }
};

class TabBarIcon extends Component {

    render() {
        const { focused, activeIcon, inactiveIcon } = this.props;
        return (
            <Image
                style={{ width: 30, height: 30, resizeMode: 'contain' }}
                source={focused ? activeIcon : inactiveIcon}
            />
        )
    }
}

export class AppTabNavigator extends Component {

    _onNavigationStateChange = (prevState, nextState) => {
        if (nextState.index === 1) {
            NavigationUtil.jumpToLogin();
        }
    }

    _tabNavigator() {
        if (!this.tabBar) {
            this.tabBar = createAppContainer(createBottomTabNavigator(TabRouteConfigs, {
                tabBarComponent: props => <BottomTabBar {...props} />,
                tabBarOptions: {
                    activeTintColor: AppUtil.app_theme,
                    inactiveTintColor: AppUtil.app_lightGray
                }
            }));
        }

        return this.tabBar;
    }

    render() {
        const TabBar = this._tabNavigator();
        return <TabBar onNavigationStateChange={this._onNavigationStateChange} />
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


