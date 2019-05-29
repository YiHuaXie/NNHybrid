import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    ActivityIndicator,
    Animated,
    Easing
} from 'react-native';
import { PropTypes } from 'prop-types';
import AppUtil from '../../utils/AppUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';

//ios-arrow-round-down
const defaultHeaderFooterHeight = 60.0;
const arrowImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABQBAMAAAD8TNiNAAAAJ1BMVEUAAACqqqplZWVnZ2doaGhqampoaGhpaWlnZ2dmZmZlZWVmZmZnZ2duD78kAAAADHRSTlMAA6CYqZOlnI+Kg/B86E+1AAAAhklEQVQ4y+2LvQ3CQAxGLSHEBSg8AAX0jECTnhFosgcjZKr8StE3VHz5EkeRMkF0rzk/P58k9rgOW78j+TE99OoeKpEbCvcPVDJ0OvsJ9bQs6Jxs26h5HCrlr9w8vi8zHphfmI0fcvO/ZXJG8wDzcvDFO2Y/AJj9ADE7gXmlxFMIyVpJ7DECzC9J2EC2ECAAAAAASUVORK5CYII=';

export const RefreshState = {
    Idle: 'Idle',
    HeaderPulling: 'HeaderPulling',
    HeaderRefreshing: 'HeaderRefreshing',

    FooterRefreshing: 'FooterRefreshing',
    NoMoreData: 'NoMoreData',
    Failure: 'Failure',
    EmptyData: 'EmptyData',
}

/**
 * 默认刷新头部组件
 */
const arrowOrActivityComponent = (refreshState, arrowAnimation) => {
    if (refreshState == RefreshState.HeaderRefreshing) {
        return (
            <ActivityIndicator style={{ marginRight: 10 }} />
        );
    } else {
        return (
            // <Animated.Ionicons
            //     name='ios-arrow-round-down'
            //     size={24}
            //     style={{
            //         color: AppUtil.app_theme,
            //         marginRight: 10,
            //         transform: [{
            //             rotateZ: arrowAnimation.interpolate({
            //                 inputRange: [0, 1],
            //                 outputRange: ['0deg', '-180deg']
            //             })
            //         }]
            //     }}
            // />
            <Animated.Image
                source={{ uri: arrowImage }}
                resizeMode={'contain'}
                style={{
                    width: 14,
                    height: 23,
                    marginRight: 10,
                    transform: [{
                        rotateZ: arrowAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '-180deg']
                        })
                    }]
                }}
            />
        );
    }
}

/**
 * 头部刷新组件的Text组件
 * @param {RefreshState} refreshState   刷新状态
 * @param {{}} props 控件的props 
 */
const headerTitleComponent = (refreshState, props) => {
    const { headerIdleText, headerPullingText, headerRefreshingText } = props;

    let headerTitle = '';

    switch (refreshState) {
        case RefreshState.Idle:
            headerTitle = headerIdleText;
            break;
        case RefreshState.HeaderPulling:
            headerTitle = headerPullingText;
            break;
        case RefreshState.HeaderRefreshing:
            headerTitle = headerRefreshingText;
            break;
        default:
            break;
    }

    return (
        <Text style={{ fontSize: 13, color: AppUtil.app_theme }}>
            {headerTitle}
        </Text>
    );
}

export default class RefreshScrollView extends ScrollView {

    static propTypes = {
        scrollViewRef: PropTypes.any, //这个可以修改为ref

        refreshState: PropTypes.string,

        onHeaderRefresh: PropTypes.func,
        onFooterRefresh: PropTypes.func,

        headerHeight: PropTypes.number,
        footerHeight: PropTypes.number,

        headerIdleText: PropTypes.string,
        headerPullingText: PropTypes.string,
        headerRefreshingText: PropTypes.string,

        footerRefreshingText: PropTypes.string,
        footerFailureText: PropTypes.string,
        footerNoMoreDataText: PropTypes.string,
        footerEmptyDataText: PropTypes.string,

        headerRefreshComponent: PropTypes.func,

        footerRefreshingText: PropTypes.string,
        footerFailureText: PropTypes.string,
        footerNoMoreDataText: PropTypes.string,
        footerEmptyDataText: PropTypes.string,

        footerRefreshingComponent: PropTypes.func,
        footerFailureComponent: PropTypes.func,
        footerNoMoreDataComponent: PropTypes.func,
        footerEmptyDataComponent: PropTypes.func,
    }

    static defaultProps = {
        scrollViewRef: 'scrollView',

        refreshState: RefreshState.Idle,

        headerIdleText: '下拉可以刷新',
        headerPullingText: '松开立即刷新',
        headerRefreshingText: '正在刷新数据中...',

        footerRefreshingText: '更多数据加载中...',
        footerFailureText: '点击重新加载',
        footerNoMoreDataText: '已加载全部数据',
        footerEmptyDataText: '暂时没有相关数据',
    }

    constructor(props) {
        super(props);

        const { headerHeight, footerHeight } = this.props;

        this.offsetY = 0;
        this.isDragging = false;
        this.headerHeight = headerHeight ? headerHeight : defaultHeaderFooterHeight;
        this.footerHeight = footerHeight ? footerHeight : defaultHeaderFooterHeight;
        // this.isRefreshing = false;

        this.state = {
            arrowAnimation: new Animated.Value(0),
            refreshState: RefreshState.Idle,
        };

    }

    // componentWillReceiveProps(nextProps) {
    //     console.log('调用 componentWillReceiveProps');

    //     if (this.state.refreshState !== RefreshState.HeaderRefreshing &&
    //         nextProps.refreshState === RefreshState.HeaderRefreshing) {
    //         const scrollView = this.refs[this.props.scrollViewRef];
    //         scrollView.scrollTo({ y: -this.headerHeight, animated: true });
    //     }

    //     this.setState({ refreshState: nextProps.refreshState });
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log(this.props);
    //     console.log(nextProps);
    //     console.log(this.state);
    //     console.log(nextState);

    //     if (nextProps.refreshState === RefreshState.HeaderRefreshing) {
    //         const scrollView = this.refs[this.props.scrollViewRef];
    //         scrollView.scrollTo({ y: -this.headerHeight, animated: true });
    //     }
    //     // if (nextProps.refreshState !== nextState.refreshState) {
    //     //     switch(nextProps.refreshState) {
    //     //         case RefreshState.HeaderRefreshing: {
    //     //             console.log('scrollView 滚动');

    //     //             const scrollView = this.refs[this.props.scrollViewRef];
    //     //             scrollView.scrollTo({ y: -this.headerHeight, animated: true });

    //     //             return {
    //     //                 refreshState: RefreshState.HeaderRefreshing
    //     //             }
    //     //         }
    //     //     }
    //     // }

    //     return nextState;
    // }

    render() {
        return (
            <ScrollView
                ref={this.props.scrollViewRef}
                {...this.props}
                scrollEventThrottle={16}
                onScroll={event => this._onScroll(event)}
                onScrollEndDrag={event => this._onScrollEndDrag(event)}
                onScrollBeginDrag={event => this._onScrollBeginDrag(event)}
            >
                {this._renderRefreshHeader()}
                {this.props.children}
            </ScrollView>
        );
    }

    /**
     * 手动调用下拉刷新
     */
    beginRefresh() {
        console.log('调用beginRefresh');
        this._onHeaderRefresh();
        // if (!this.isRefreshing) {
        //     this.isRefreshing = true;
        //     this.setState({
        //         refreshState: RefreshState.HeaderRefreshing,
        //     });

        //     const scrollView = this.refs[this.props.scrollViewRef];
        //     scrollView.scrollTo({ y: -this.headerHeight, animated: true });

        //     if (this.props.onHeaderRefresh) {
        //         this.props.onHeaderRefresh(() => this._headerRefreshEnd());
        //     } else {
        //         this._headerRefreshEnd();
        //     }
        // }
    }

    /**
     * 手动结束
     */
    endRefresh() {
        this._headerRefreshEnd();
    }

    /**
     * 加载下拉刷新组件
     */
    _renderRefreshHeader = () => {
        const { headerRefreshComponent } = this.props;
        const { arrowAnimation, refreshState } = this.state;

        if (headerRefreshComponent) {
            return (
                <View style={{
                    ...styles.customHeader,
                    top: -this.headerHeight,
                    height: this.headerHeight
                }}>
                    {headerRefreshComponent(refreshState, this.offsetY)}
                </View>
            );
        } else {
            return (
                <View style={{
                    ...styles.defaultHeader,
                    top: -this.headerHeight,
                    height: this.headerHeight
                }} >
                    {arrowOrActivityComponent(refreshState, arrowAnimation)}
                    {headerTitleComponent(refreshState, this.props)}
                </View >
            );
        }
    }

    /**
     * 列表正在滚动
     * @private
     * @param {{}} event 
     */
    _onScroll(event) {
        this.offsetY = event.nativeEvent.contentOffset.y;

        if (this.isDragging) {
            if (!this._isRefreshing()) {//!this.isRefreshing
                if (this.offsetY <= -this.headerHeight) {
                    // 松开以刷新
                    this.setState({ refreshState: RefreshState.HeaderPulling });
                    // Animated.timing(this.state.arrowAnimation, {
                    //     toValue: 1,
                    //     duration: 50,
                    //     easing: Easing.inOut(Easing.quad)
                    // }).start();
                } else {
                    // 下拉以刷新
                    this.setState({ refreshState: RefreshState.Idle });
                    // Animated.timing(this.state.arrowAnimation, {
                    //     toValue: 0,
                    //     duration: 100,
                    //     easing: Easing.inOut(Easing.quad)
                    // }).start();
                }
            }
        }

        if (this.props.onScroll) {
            this.props.onScroll(event);
        }
    }

    /**
     * 列表开始拖拽
     * @private
     * @param {{}} event 
     */
    _onScrollBeginDrag(event) {
        this.isDragging = true;
        this.offsetY = event.nativeEvent.contentOffset.y;

        if (this.props.onScrollBeginDrag) {
            this.props.onScrollBeginDrag(event);
        }
    }

    /**
     * 列表结束拖拽
     * @private
     * @param {{}} event 
     */
    _onScrollEndDrag(event) {
        this.isDragging = false;
        this.offsetY = event.nativeEvent.contentOffset.y;

        if (!this._isRefreshing()) {//!this.isRefreshing
            if (this.state.refreshState === RefreshState.HeaderPulling) {
                // this.isRefreshing = true;
                this._onHeaderRefresh();
            }
        }

        // 该方法还不知道有什么用,拖拽到一半的时候接受到手动刷新的通知吧
        // else {
        //     console.log('调用adasdasd');
        //     console.log(this.offsetY);

        //     if (this.offsetY <= 0) {
        //         const scrollView = this.refs[this.props.scrollViewRef];
        //         scrollView.scrollTo({ y: -this.headerHeight, animated: true });
        //     }
        // }

        if (this.props.onScrollEndDrag) {
            this.props.onScrollEndDrag(event);
        }
    }

    _isRefreshing = () => {
        return (
            this.state.refreshState === RefreshState.HeaderRefreshing &&
            this.state.refreshState !== RefreshState.FooterRefreshing
        );
    }

    _headerRefreshEnd() {
        // this.isRefreshing = false;

        this.setState({
            refreshState: RefreshState.Idle,
        });

        // Animated.timing(this.state.arrowAnimation, {
        //     toValue: 0,
        //     duration: 100,
        //     easing: Easing.inOut(Easing.quad)
        // }).start();

        const scrollView = this.refs[this.props.scrollViewRef];
        scrollView.scrollTo({ y: 0, animated: true });
    }

    // _headerShouldRefreshing = () => {
    //     const { refreshState } = this.props;

    //     if (refreshState === RefreshState.HeaderRefreshing ||
    //         refreshState === RefreshState.FooterRefreshing) {
    //         return false;
    //     }

    //     return true;
    // }

    _onHeaderRefresh = () => {
        const { onHeaderRefresh } = this.props;
        const { refreshState } = this.state;

        if (refreshState === RefreshState.HeaderRefreshing ||
            refreshState === RefreshState.FooterRefreshing) {
            return;
        }

        this.setState({ refreshState: RefreshState.HeaderRefreshing });

        const scrollView = this.refs[this.props.scrollViewRef];
        scrollView.scrollTo({ y: -this.headerHeight, animated: true });

        if (onHeaderRefresh) {
            onHeaderRefresh();
        } else {
            this._headerRefreshEnd();
        }
    }
}

const styles = StyleSheet.create({
    customHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    defaultHeader: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        left: 0,
        right: 0,
    },
});