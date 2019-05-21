import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { PropTypes } from 'prop-types';
import AppUtil from '../../utils/AppUtil';
import Refresher from '../common/Refresher';

export const RefreshState = {
    Idle: 0,
    HeaderRefreshing: 1,
    FooterRefreshing: 2,
    NoMoreData: 3,
    Failure: 4,
    EmptyData: 5,
};

export default class NNRefreshFlatList extends Component {

    static propTypes = {
        refreshState: PropTypes.number,
        onHeaderRefresh: PropTypes.func,
        onFooterRefresh: PropTypes.func,
        data: PropTypes.array,

        listRef: PropTypes.any,

        footerRefreshingText: PropTypes.string,
        footerFailureText: PropTypes.string,
        footerNoMoreDataText: PropTypes.string,
        footerEmptyDataText: PropTypes.string,

        footerRefreshingComponent: PropTypes.any,
        footerFailureComponent: PropTypes.any,
        footerNoMoreDataComponent: PropTypes.any,
        footerEmptyDataComponent: PropTypes.any,

        renderItem: PropTypes.func,
    };

    static defaultProps = {
        footerRefreshingText: '数据加载中…',
        footerFailureText: '点击重新加载',
        footerNoMoreDataText: '已加载全部数据',
        footerEmptyDataText: '暂时没有相关数据',
    }

    onHeaderRefresh = () => {
        const { onHeaderRefresh } = this.props;

        if (this.shouldStartHeaderRefreshing()) {
            onHeaderRefresh(RefreshState.HeaderRefreshing)
        }
    }

    onEndReached = () => {
        const { onFooterRefresh } = this.props;

        if (this.shouldStartFooterRefreshing()) {
            onFooterRefresh && onFooterRefresh(RefreshState.FooterRefreshing)
        }
    }

    shouldStartHeaderRefreshing = () => {
        const { refreshState } = this.props;

        if (refreshState == RefreshState.HeaderRefreshing ||
            refreshState == RefreshState.FooterRefreshing) {
            return false;
        }

        return true;
    }

    shouldStartFooterRefreshing = () => {
        const { refreshState, data } = this.props;
        if (data.length == 0) {
            return false;
        }

        return refreshState == RefreshState.Idle;
    }

    render() {
        const { renderItem, refreshState, ...rest } = this.props;

        const refreshControl = Refresher.header({
            title: '数据加载中…',
            refreshing: refreshState == RefreshState.HeaderRefreshing,
            onRefresh: this.onHeaderRefresh
        });

        return (
            <FlatList
                ref={this.props.listRef}
                onEndReached={this.onEndReached}
                refreshControl={refreshControl}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.1}
                renderItem={renderItem}
                {...rest}
            />
        );
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
                const defaultFooterFailureComponent = (
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>{footerFailureText}</Text>
                    </View>
                );

                const pressHandler = () => {
                    if (data.length == 0) {
                        onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
                    } else {
                        onFooterRefresh && onFooterRefresh(RefreshState.FooterRefreshing);
                    }
                };

                return (
                    <TouchableOpacity onPress={() => pressHandler()}>
                        {footerFailureComponent ? footerFailureComponent : defaultFooterFailureComponent}
                    </TouchableOpacity>
                );
            }
            case RefreshState.EmptyData: {
                const defaultFooterEmptyDataComponent = (
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>{footerEmptyDataText}</Text>
                    </View>
                );

                const pressHandler = () => {
                    onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
                };

                return (
                    <TouchableOpacity onPress={() => pressHandler()}>
                        {footerEmptyDataComponent ? footerEmptyDataComponent : defaultFooterEmptyDataComponent}
                    </TouchableOpacity>
                );
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