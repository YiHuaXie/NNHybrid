import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ActivityIndicator,
    Animated,
    Easing
} from 'react-native';
import AppUtil from '../../utils/AppUtil';
import { TouchableOpacity } from 'react-native-gesture-handler';

// 默认刷新控件高度
export const defaultHeight = 60;

// 下拉刷新状态
export const HeaderRefreshState = {
    Idle: 'Idle',
    Pulling: 'Pulling',
    Refreshing: 'Refreshing',
}

// 加载更多状态
export const FooterRefreshState = {
    Idle: 'Idle',
    Refreshing: 'Refreshing',
    NoMoreData: 'NoMoreData',
    EmptyData: 'EmptyData',
    Failure: 'Failure',
}

// 下拉刷新默认props
export const defaultHeaderProps = {
    headerIsRefreshing: false,
    headerHeight: defaultHeight,
    headerIdleText: '下拉可以刷新',
    headerPullingText: '松开立即刷新',
    headerRefreshingText: '正在刷新数据中...',
}

// 加载更多默认props
export const defaultFooterProps = {
    footerRefreshState: FooterRefreshState.Idle,
    footerHeight: defaultHeight,
    footerRefreshingText: '更多数据加载中...',
    footerFailureText: '点击重新加载',
    footerNoMoreDataText: '已加载全部数据',
    footerEmptyDataText: '暂时没有相关数据',
}

// 默认下拉刷新组件
export const defaultHeaderRefreshComponent = ({ }) => {

}


const headerTitleComponent = ({
    headerRefreshState,
    headerIdleText,
    headerPullingText,
    headerRefreshingText }) => {
    let headerTitle = '';

    switch (headerRefreshState) {
        case HeaderRefreshState.Idle:
            return headerIdleText;
        case HeaderRefreshState.Pulling:
            return headerPullingText;
        case HeaderRefreshState.Refreshing:
            return headerRefreshingText;
        default:
            return '';
    }

    return (
        <Text style={{ fontSize: 13, color: AppUtil.app_theme }}>
            {headerTitle}
        </Text>
    );
}


// 默认加载更多组件
export const defaultFooterRefreshComponent = ({
    footerRefreshState,
    footerRefreshingText,
    footerFailureText,
    footerNoMoreDataText,
    footerEmptyDataText,
    onHeaderRefresh,
    onFooterRefresh,
    data }) => {
    switch (footerRefreshState) {
        case FooterRefreshState.Idle:
            return (
                <View style={styles.footerContainer} />
            );
        case FooterRefreshState.Refreshing:
            return (
                <View style={styles.footerContainer} >
                    <ActivityIndicator size="small" color={AppUtil.app_theme} />
                    <Text style={[styles.footerText, { marginLeft: 7 }]}>
                        {footerRefreshingText}
                    </Text>
                </View>
            );
        case FooterRefreshState.Failure:
            return (
                <TouchableOpacity onPress={() => {
                    if (AppUtil.isEmptyArray(data)) {
                        onHeaderRefresh && onHeaderRefresh();
                    } else {
                        onFooterRefresh && onFooterRefresh();
                    } Î
                }}>
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>{footerFailureText}</Text>
                    </View>
                </TouchableOpacity>
            );
        case FooterRefreshState.EmptyData:
            return (
                <TouchableOpacity onPress={() => { onHeaderRefresh && onHeaderRefresh(); }}>
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>{footerEmptyDataText}</Text>
                    </View>
                </TouchableOpacity>
            );
        case FooterRefreshState.NoMoreData:
            return (
                <View style={styles.footerContainer} >
                    <Text style={styles.footerText}>{footerNoMoreDataText}</Text>
                </View>
            );
    }

    return null;
}

const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 60,
    },
    footerText: {
        fontSize: 14,
        color: AppUtil.app_theme
    }
});