import React, { Component } from 'react';
import { ViewPropTypes, Text, View, StatusBar, StyleSheet, Platform, TouchableOpacity, DeviceInfo } from 'react-native';
import { PropTypes } from 'prop-types';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import AppDefine from '../Define/AppDefine';

// const NAV_BAR_HEIGHT_IOS = 44;//导航栏在iOS中的高度
// const NAV_BAR_HEIGHT_ANDROID = 50;//导航栏在Android中的高度
// const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20;//状态栏的高度

// const StatusBarShape = {//设置状态栏所接受的属性
//     barStyle: PropTypes.oneOf(['light-content', 'default',]),
//     hidden: PropTypes.bool,
//     backgroundColor: PropTypes.string,
// };

// /**
//  * 自定义NavigationBar
//  */
// export default class NavigationBar extends Component {
//     static propTypes = {
//         style: ViewPropTypes.style,
//         title: PropTypes.string,
//         titleView: PropTypes.element,
//         titleLayoutStyle: ViewPropTypes.style,
//         hide: PropTypes.bool,
//         statusBar: PropTypes.shape(StatusBarShape),
//         rightButton: PropTypes.element,
//         leftButton: PropTypes.element,
//     };

//     //设置默认属性
//     static defaultProps = {
//         statusBar: {
//             barStyle: 'light-content',
//             hidden: false
//         },
//     };

//     render() {
//         let statusBar = !this.props.statusBar.hidden ?
//             <View style={styles.statusBar}>
//                 <StatusBar {...this.props.statusBar} />
//             </View> : null;

//         let titleView = this.props.titleView ? this.props.titleView :
//             <Text ellipsizeMode="tail" numberOfLines={1} style={styles.navigationBarTitle}>{this.props.title}</Text>;

//         let content = this.props.hide ? null :
//             <View style={styles.navigationBar}>
//                 {this.getButtonElement(this.props.leftButton)}
//                 <View style={[styles.navigationBarTitleView, this.props.titleLayoutStyle]}>
//                     {titleView}
//                 </View>
//                 {this.getButtonElement(this.props.rightButton)}
//             </View>;
//         return (
//             <View style={[styles.container, this.props.style]}>
//                 {statusBar}
//                 {content}
//             </View>
//         )
//     }

//     getButtonElement(element) {
//         return (
//             <View style={styles.navigationBarButton}>
//                 {element ? element : null}
//             </View>
//         );
//     }

//     /**
//      * NaviagtionBar默认返回按钮
//      * @param {*} calllBack 按钮点击回调
//      */
//     static backButton(calllBack) {
//         return (
//             <TouchableOpacity
//                 style={{ padding: 8, paddingLeft: 12 }}
//                 onPress={calllBack}>
//                 <Ionicons
//                     name={'ios-arrow-back'}
//                     size={24}
//                     style={{ color: '#FFFFFF' }}
//                 />
//             </TouchableOpacity>
//         );
//     }

//     /**
//      * NavigationBar默认分享按钮
//      * @param {*} calllBack 按钮点击回调
//      */
//     static shareButton(calllBack) {
//         return (
//             <TouchableOpacity
//                 // style={{ padding: 8, paddingLeft: 12 }}
//                 underlayColor={'transparent'}
//                 onPress={calllBack}>
//                 <Ionicons
//                     name={'md-share'}
//                     size={24}
//                     style={{ color: '#FFFFFF', marginRight: 10, opacity: 0.9 }}
//                 />
//             </TouchableOpacity>
//         );
//     }

//     /**
//      * 获取右侧文字按钮
//      * @param title
//      * @param callBack
//      * @returns {XML}
//      */
//     static rightButton(title, callBack) {
//         return <TouchableOpacity
//             style={{ alignItems: 'center', }}
//             onPress={callBack}>
//             <Text style={{ fontSize: 20, color: '#FFFFFF', marginRight: 10 }}>{title}</Text>
//         </TouchableOpacity>
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#2196f3',
//     },
//     statusBar: {
//         height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
//     },
//     navigationBarTitle: {
//         fontSize: 20,
//         color: '#fff',
//     },
//     navigationBarButton: {
//         alignItems: 'center',
//     },
//     navigationBar: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',//两边元素顶边显示
//         height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
//     },
//     navigationBarTitleView: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         position: 'absolute',//这里使用绝对布局，因为titleView的位置不能因为左右元素的变化而变化
//         left: 40,
//         right: 40,
//         top: 0,
//         bottom: 0,
//     }
// });