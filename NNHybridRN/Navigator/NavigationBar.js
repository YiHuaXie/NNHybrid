import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { PropTypes } from 'prop-types';
import AppUtil from '../utils/AppUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * 自定义NavigationBar
 */
export default class NavigationBar extends Component {

    static propTypes = {
        navHidden: PropTypes.bool,
        navBarStyle: PropTypes.object,
        navContentStyle: PropTypes.object,
        backgroundView: PropTypes.element,
        leftItem: PropTypes.element,
        leftItemStyle: PropTypes.object,
        rightItem: PropTypes.element,
        rightItemStyle: PropTypes.object,
        backOrClose: PropTypes.string,
        backOrCloseHandler: PropTypes.func,
        title: PropTypes.string,
        titleColor: PropTypes.string,
        customTitleView: PropTypes.element,
        titleViewHidden: PropTypes.bool,
    };

    _backOrCloseButton(text) {
        if (!text) return null;

        let result = text === 'back' ? 'ios-arrow-round-back' : 'md-close';

        return (
            <TouchableOpacity onPress={() => this.props.backOrCloseHandler()}>
                <Ionicons name={result} size={24} style={{ color: AppUtil.app_black }} />
            </TouchableOpacity>
        );
    }

    _renderBackgroundView() {
        return this.props.backgroundView ? this.props.backgroundView : null;
    }

    _renderLeftItem() {
        const { leftItem, leftItemStyle, backOrClose } = this.props;

        return (
            <View style={{
                ...styles.navigationBarButton,
                marginLeft: 15,
                ...leftItemStyle
            }}>
                {leftItem ? leftItem : this._backOrCloseButton(backOrClose)}
            </View>
        );
    }

    _renderTitleView() {
        const { titleHidden, customTitleView, title, titleColor } = this.props;

        if (titleHidden) return null;

        const defaultTitleView = (
            <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[styles.navigationBarTitle, titleColor]}
            >
                {title}
            </Text>
        );

        return (
            <View style={styles.navigationBarTitleView}>
                {customTitleView ? customTitleView : defaultTitleView}
            </View>
        );
    }

    _renderRightItem() {
        const { rightItem, rightItemStyle } = this.props;

        return (
            <View style={{
                ...styles.navigationBarButton,
                marginRight: 15,
                ...rightItemStyle
            }}>
                {rightItem}
            </View>
        );
    }

    render() {
        if (this.props.navHidden) return null;

        return (
            <View style={[styles.navigationBar, this.props.navBarStyle]}>
                {this._renderBackgroundView()}
                <View style={[styles.navigationBarContent, this.props.navContentStyle]}>
                    {this._renderLeftItem()}
                    {this._renderTitleView()}
                    {this._renderRightItem()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navigationBar: {
        backgroundColor: '#FFFFFF',
        height: AppUtil.fullNavigationBarHeight,
        width: AppUtil.windowWidth,
    },
    navigationBarContent: {
        backgroundColor: AppUtil.app_clear,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',//两边元素顶边显示
        height: AppUtil.navigationBarHeight,
        marginTop: AppUtil.statusBarHeight,
    },
    navigationBarTitle: {
        fontSize: AppUtil.navigationTitleFont,
        textAlign: 'center',
        color: AppUtil.app_black,
    },
    navigationBarButton: {

    },
    navigationBarTitleView: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',//这里使用绝对布局，因为titleView的位置不能因为左右元素的变化而变化
        left: 40,
        right: 40,
        top: 0,
        bottom: 0,
    }
});