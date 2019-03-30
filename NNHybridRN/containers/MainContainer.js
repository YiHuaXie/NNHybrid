import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
// import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
// // import { BottomTabBar } from 'react-navigation-tabs';

// import TabBarIcon from '../components/TabBarIcon';

// import HomePage from '../sections/home/HomePage';
// import MePage from '../sections/me/MePage';
// import AppUtil from '../utils/AppUtil';

// // 路由配置对象是从路由名称到路由配置的映射，告诉导航器该路由呈现什么。
// const TabRouteConfigs = {
//     HomePage: {
//         screen: HomePage,
//         navigationOptions: {
//             tabBarLabel: "首页",
//             tabBarIcon: ({ focused, tintColor }) => (
//                 <TabBarIcon
//                     focused={focused}
//                     inactiveIcon={require('../resource/images/tabbar/tab_bar_home_normal.png')}
//                     activeIcon={require('./resource/images/tabbar/tab_bar_home_selected.png')}
//                 />
//             )
//         },
//     },
//     MePage: {
//         screen: MePage,
//         navigationOptions: {
//             tabBarLabel: "我的",
//             tabBarIcon: ({ focused, tintColor }) => (
//                 <TabBarIcon
//                     focused={focused}
//                     inactiveIcon={require('../resource/images/tabbar/tab_bar_me_normal.png')}
//                     activeIcon={require('./resource/images/tabbar/tab_bar_me_selected.png')}
//                 />
//             )
//         }
//     }
// };

// const TabBarComponent = (props) => (<TabBarComponent {...props} />)

// export const AppTabNavigator = createAppContainer(createBottomTabNavigator(
//     TabRouteConfigs,
//     {
//         tabBarComponent: TabBarComponent,
//         tabBarOptions: {
//             activeTintColor: AppUtil.app_theme,
//             inactiveTintColor: 'black'
//         }
//     }
// ));

/**
 * 相当于TabBarController
 */
export default class MainContainer extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            // <View style={{ flex: 1 }}>
            //     <AppTabNavigator />
            // </View>
            <View style={styles.container}>
            <Text style={styles.welcome}>dasdasdPage</Text>
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
