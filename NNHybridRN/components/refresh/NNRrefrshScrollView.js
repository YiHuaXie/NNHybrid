import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import { PropTypes } from 'prop-types';
import AppUtil from '../../utils/AppUtil';
import Refresher from '../common/Refresher';

export const RefreshState = {
    Idle: 'Idle',
    HeaderRefreshing: 'HeaderRefreshing',
    FooterRefreshing: 'FooterRefreshing',
    NoMoreData: 'NoMoreData',
    Failure: 'Failure',
    EmptyData: 'EmptyData',
};

// 支持的scrollView类型
const scrollComponents = ['ScrollView', 'ListView', 'FlatList', 'VirtualizedList'];

export default class NNRefreshScrollView extends Component {
    _headerRefreshDoneHandle = null//刷新操作完成监听句柄
    _headerRefreshInstance = null//刷新头实例
    _footerInfiniteDoneHandle = null//加载操作完成监听句柄
    _footerInfiniteInstance = null//加载尾实例

    static headerRefreshDone = () => DeviceEventEmitter.emit(EVENT_HEADER_REFRESH, true)
    static footerInfiniteDone = () => DeviceEventEmitter.emit(EVENT_FOOTER_INFINITE, true)

    static propTypes = {
        scrollComponent: PropTypes.oneOf(scrollComponents).isRequired,

        refreshState: PropTypes.string,
        onHeaderRefresh: PropTypes.func,
        onFooterRefresh: PropTypes.func,
        data: PropTypes.array,

        listRef: PropTypes.any,

        headerRefreshingText: PropTypes.string,

        footerRefreshingText: PropTypes.string,
        footerFailureText: PropTypes.string,
        footerNoMoreDataText: PropTypes.string,
        footerEmptyDataText: PropTypes.string,

        footerRefreshingComponent: PropTypes.element,
        footerFailureComponent: PropTypes.element,
        footerNoMoreDataComponent: PropTypes.element,
        footerEmptyDataComponent: PropTypes.element,

        renderItem: PropTypes.func,
    };

    static defaultProps = {
        listRef: 'refreshFlatList',
        headerRefreshingText: '数据加载中...',
        footerRefreshingText: '数据加载中...',
        footerFailureText: '点击重新加载',
        footerNoMoreDataText: '已加载全部数据',
        footerEmptyDataText: '暂时没有相关数据',
    }

    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    onHeaderRefresh = () => {
        const { onHeaderRefresh } = this.props;

        if (this.headerShouldRefreshing()) {
            onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
        }
    }

    onEndReached = () => {
        const { onFooterRefresh } = this.props;

        if (this.footerShouldRefreshing()) {
            onFooterRefresh && onFooterRefresh(RefreshState.FooterRefreshing);
        }
    }

    headerShouldRefreshing = () => {
        const { refreshState } = this.props;

        if (refreshState === RefreshState.HeaderRefreshing ||
            refreshState === RefreshState.FooterRefreshing) {
            return false;
        }

        return true;
    }

    footerShouldRefreshing = () => {
        const { refreshState, data } = this.props;
        if (AppUtil.isEmptyArray(data)) {
            return false;
        }

        return refreshState === RefreshState.Idle;
    }

    renderFooter = () => {
        const {
            refreshState,

            footerRefreshingText,
            footerFailureText,
            footerNoMoreDataText,
            footerEmptyDataText,

            footerRefreshingComponent,
            footerFailureComponent,
            footerNoMoreDataComponent,
            footerEmptyDataComponent,

            onHeaderRefresh,
            onFooterRefresh,
            data,
        } = this.props;

        switch (refreshState) {
            case RefreshState.Idle:
                return (
                    <View style={styles.footerContainer} />
                );
            case RefreshState.Failure: {
                const pressHandler = () => {
                    if (AppUtil.isEmptyArray(data)) {
                        onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
                    } else {
                        onFooterRefresh && onFooterRefresh(RefreshState.FooterRefreshing);
                    }
                };

                const defaultFooterFailureComponent = (
                    <TouchableOpacity onPress={() => pressHandler()}>
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>{footerFailureText}</Text>
                        </View>
                    </TouchableOpacity>
                );

                return footerFailureComponent ? footerFailureComponent : defaultFooterFailureComponent;
            }
            case RefreshState.EmptyData: {
                const pressHandler = () => {
                    onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
                };

                const defaultFooterEmptyDataComponent = (
                    <TouchableOpacity onPress={() => pressHandler}>
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>{footerEmptyDataText}</Text>
                        </View>
                    </TouchableOpacity>
                );

                return footerEmptyDataComponent ? footerEmptyDataComponent : defaultFooterEmptyDataComponent;
            }
            case RefreshState.FooterRefreshing: {
                const defaultFooterRefreshingComponent = Refresher.footer(footerRefreshingText);
                return footerRefreshingComponent ? footerRefreshingComponent : defaultFooterRefreshingComponent;
            }
            case RefreshState.NoMoreData: {
                const defaultFooterNoMoreDataComponent = (
                    <View style={styles.footerContainer} >
                        <Text style={styles.footerText}>
                            {footerNoMoreDataText}
                        </Text>
                    </View>
                );

                return footerNoMoreDataComponent ? footerNoMoreDataComponent : defaultFooterNoMoreDataComponent;
            }
        }

        return null;
    }

    render() {
        const { renderItem, refreshState, headerRefreshingText, ...rest } = this.props;

        const refreshControl = Refresher.header({
            title: headerRefreshingText,
            refreshing: refreshState === RefreshState.HeaderRefreshing,
            onRefresh: this.onHeaderRefresh
        });

        return (
            <FlatList
                ref={this.props.listRef}
                onEndReached={this.onEndReached}
                refreshControl={refreshControl}
                // refreshing={refreshState === RefreshState.HeaderRefreshing}
                // onRefresh={this.onHeaderRefresh}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.1}
                renderItem={renderItem}
                {...rest}
            />
        );
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 44,
    },
    footerText: {
        fontSize: 14,
        color: AppUtil.app_theme
    }
});

