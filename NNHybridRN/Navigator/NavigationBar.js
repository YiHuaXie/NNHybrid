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
        backgroundView: PropTypes.element,
        backgroundViewStyle: PropTypes.object,
        leftItem: PropTypes.element,
        leftItemStyle: PropTypes.object,
        rightItem: PropTypes.element,
        rightItemStyle: PropTypes.object,
        backOrClose: PropTypes.string,
        backOrCloseHandler: PropTypes.func,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleHidden: PropTypes.bool,
        hidden: PropTypes.bool,
        navBarStyle: PropTypes.object,
        contentStyle: PropTypes.object,
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

    _defaultTitleView() {
        return (
            <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.navigationBarTitle}>
                {this.props.title}
            </Text>
        );
    }

    render() {
        const {
            navBarStyle,
            backgroundView,
            contentStyle,
            titleHidden,
            leftItem,
            leftItemStyle,
            rightItem,
            rightItemStyle } = this.props;
        if (this.props.hidden) return null;
        return (
            <View style={[styles.navigationBar, navBarStyle]}>
                <View style={styles.navigationBackground}>
                    {backgroundView}
                </View>
                <View style={[styles.navigationBarContent, contentStyle]}>
                    <View style={{
                        ...styles.navigationBarButton,
                        marginLeft: 15,
                        ...leftItemStyle
                    }}>
                        {leftItem ? leftItem : this._backOrCloseButton(this.props.backOrClose)}
                    </View>
                    {titleHidden ?
                        <View style={styles.navigationBarTitleView}>
                            {this.props.titleView ? this.props.titleView : this._defaultTitleView()}
                        </View> : null}
                    <View style={{
                        ...styles.navigationBarButton,
                        marginRight: 15,
                        ...rightItemStyle
                    }}>
                        {rightItem}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navigationBar: {
        backgroundColor: '#FFFFFF',
        height: AppUtil.fullNavigationBarHeight,
    },
    navigationBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: AppUtil.windowWidth,
        height: AppUtil.fullNavigationBarHeight
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
        alignItems: 'center',
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