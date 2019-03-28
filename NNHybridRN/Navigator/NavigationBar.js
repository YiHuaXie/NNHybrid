import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { PropTypes } from 'prop-types';
import AppDefine from '../Define/AppDefine';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * 自定义NavigationBar
 */
export default class NavigationBar extends Component {

    static propTypes = {
        leftButton: PropTypes.element,
        rightButton: PropTypes.element,
        backOrClose: PropTypes.string,
        backOrCloseHandler: PropTypes.func,
        title: PropTypes.string,
        titleView: PropTypes.element,
        hidden: PropTypes.bool,
    };

    _backOrCloseButton(text) {
        if (!text) return null;

        let result = text === 'back' ? 'ios-arrow-round-back' : 'md-close';

        return (
            <TouchableOpacity onPress={() => this.props.backOrCloseHandler()}>
                <Ionicons name={result} size={24} style={{ color: AppDefine.app_black }} />
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
        console.log(AppDefine.fullNavigationBarHeight);
        if (this.props.hidden) return null;
        return (
            <View style={styles.navigationBar}>
                <View style={styles.navigationBarContent}>
                    <View style={styles.navigationBarButton}>
                        {this.props.leftButton ? this.props.leftButton : this._backOrCloseButton(this.props.backOrClose)}
                    </View>

                    <View style={styles.navigationBarTitleView}>
                        {this.props.titleView ? this.props.titleView : this._defaultTitleView()}
                    </View>

                    <View style={styles.navigationBarButton}>
                        {this.props.rightButton}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navigationBar: {
        backgroundColor: '#FFFFFF',
        height: AppDefine.fullNavigationBarHeight
    },
    navigationBarContent: {
        backgroundColor: AppDefine.app_clear,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',//两边元素顶边显示
        height: AppDefine.navigationBarHeight,
        marginTop: AppDefine.statusBarHeight,
    },

    navigationBarTitle: {
        fontSize: AppDefine.navigationTitleFont,
        textAlign: 'center',
        color: AppDefine.app_black,
    },
    navigationBarButton: {
        marginLeft: 15,
        marginRight: 15,
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