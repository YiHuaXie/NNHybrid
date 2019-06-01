import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    ActivityIndicator,
    Animated,
    Easing
} from 'react-native';
import { PropTypes } from 'prop-types';
import AppUtil from '../../utils/AppUtil';

import {
    HeaderRefreshState,
    FooterRefreshState,
    defaultHeaderProps,
    defaultFooterProps,
    defaultHeaderRefreshComponent,
    defaultFooterRefreshComponent
} from './RefreshConst';
import { TouchableOpacity } from 'react-native-gesture-handler';

const arrowImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABQBAMAAAD8TNiNAAAAJ1BMVEUAAACqqqplZWVnZ2doaGhqampoaGhpaWlnZ2dmZmZlZWVmZmZnZ2duD78kAAAADHRSTlMAA6CYqZOlnI+Kg/B86E+1AAAAhklEQVQ4y+2LvQ3CQAxGLSHEBSg8AAX0jECTnhFosgcjZKr8StE3VHz5EkeRMkF0rzk/P58k9rgOW78j+TE99OoeKpEbCvcPVDJ0OvsJ9bQs6Jxs26h5HCrlr9w8vi8zHphfmI0fcvO/ZXJG8wDzcvDFO2Y/AJj9ADE7gXmlxFMIyVpJ7DECzC9J2EC2ECAAAAAASUVORK5CYII=';



/**
 * 默认刷新头部组件
 */
const arrowOrActivityComponent = (headerRefreshState, arrowAnimation) => {
    if (headerRefreshState == HeaderRefreshState.Refreshing) {
        return (
            <ActivityIndicator style={{ marginRight: 10 }} />
        );
    } else {
        return (
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
const headerTitleComponent = (headerRefreshState, props) => {
    const { headerIdleText, headerPullingText, headerRefreshingText } = props;

    let headerTitle = '';

    switch (headerRefreshState) {
        case HeaderRefreshState.Idle:
            headerTitle = headerIdleText;
            break;
        case HeaderRefreshState.Pulling:
            headerTitle = headerPullingText;
            break;
        case HeaderRefreshState.Refreshing:
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

export default class RefreshFlatList extends Component {

    static propTypes = {
        listRef: PropTypes.any,
        data: PropTypes.array,
        renderItem: PropTypes.func,

        // Header相关属性
        headerIsRefreshing: PropTypes.bool,

        headerHeight: PropTypes.number,

        onHeaderRefresh: PropTypes.func,

        headerIdleText: PropTypes.string,
        headerPullingText: PropTypes.string,
        headerRefreshingText: PropTypes.string,

        headerRefreshComponent: PropTypes.func,

        // Footer相关属性
        footerRefreshState: PropTypes.string,

        onFooterRefresh: PropTypes.func,

        footerHeight: PropTypes.number,

        footerRefreshingText: PropTypes.string,
        footerFailureText: PropTypes.string,
        footerNoMoreDataText: PropTypes.string,
        footerEmptyDataText: PropTypes.string,

        footerRefreshComponent: PropTypes.func,
    };

    static defaultProps = {
        listRef: 'flatList',
        ...defaultHeaderProps,
        ...defaultFooterProps,
    }

    constructor(props) {
        super(props);

        const { headerHeight, footerHeight } = this.props;

        this.offsetY = 0;
        this.isDragging = false;
        this.headerHeight = headerHeight;
        this.footerHeight = footerHeight;

        this.state = {
            arrowAnimation: new Animated.Value(0),
            headerRefreshState: HeaderRefreshState.Idle,
        };

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps === this.props && nextState === this.state) return false;
        // if (nextProps.headerIsRefreshing === false && nextState.headerRefreshState === this.state.headerRefreshState) {
        //     return false;
        // }

        return true;
    }

    componentWillReceiveProps(nextProps) {
        const { headerIsRefreshing, listRef } = nextProps;


        if (headerIsRefreshing !== this.props.headerIsRefreshing) {
            // console.log('调用一下'+ headerIsRefreshing + this.props.headerIsRefreshing);

            const offset = headerIsRefreshing ? -this.headerHeight : 0;
            const headerRefreshState = headerIsRefreshing ? HeaderRefreshState.Refreshing : HeaderRefreshState.Idle;

            this.refs[listRef].scrollToOffset({ animated: true, offset });
            this.setState({ headerRefreshState });
        } 
    }

    /**
     * 加载下拉刷新组件
     */
    _renderHeader = () => {
        const { headerRefreshComponent } = this.props;
        const { arrowAnimation, headerRefreshState } = this.state;

        if (headerRefreshComponent) {
            return (
                <View style={{ marginTop: -this.headerHeight, height: this.headerHeight }}>
                    {headerRefreshComponent(headerRefreshState, this.offsetY)}
                </View>
            );
        } else {
            return (
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: -this.headerHeight,
                    height: this.headerHeight
                }} >
                    {arrowOrActivityComponent(headerRefreshState, arrowAnimation)}
                    {headerTitleComponent(headerRefreshState, this.props)}
                </View >
            );
        }
    }

    /**
     * 加载更多组件
     */
    _renderFooter = () => {
        const {
            footerRefreshState,

            // footerRefreshingText,
            // footerFailureText,
            // footerNoMoreDataText,
            // footerEmptyDataText,

            footerRefreshComponent,

            // onHeaderRefresh,
            // onFooterRefresh,
            // data,
        } = this.props;

        if (footerRefreshComponent) {
            const component = footerRefreshComponent(footerRefreshState);
            if (component) return component;
        }

        return defaultFooterRefreshComponent({ ...this.props });
        // switch (footerRefreshState) {
        //     case FooterRefreshState.Idle: {
        //         return (
        //             <View style={styles.footerContainer} />
        //         );
        //     }
        //     case FooterRefreshState.Refreshing: {
        //         return (
        //             <View style={styles.footerContainer} >
        //                 <ActivityIndicator size="small" color={AppUtil.app_theme} />
        //                 <Text style={[styles.footerText, { marginLeft: 7 }]}>
        //                     {footerRefreshingText}
        //                 </Text>
        //             </View>
        //         );
        //     }
        //     case FooterRefreshState.Failure: {
        //         const pressHandler = () => {
        //             if (AppUtil.isEmptyArray(data)) {
        //                 onHeaderRefresh && onHeaderRefresh();
        //             } else {
        //                 onFooterRefresh && onFooterRefresh();
        //             }
        //         };

        //         return (
        //             <TouchableOpacity onPress={() => pressHandler()}>
        //                 <View style={styles.footerContainer}>
        //                     <Text style={styles.footerText}>{footerFailureText}</Text>
        //                 </View>
        //             </TouchableOpacity>
        //         );
        //     }
        //     case FooterRefreshState.EmptyData: {
        //         return (
        //             <TouchableOpacity onPress={() => { onHeaderRefresh && onHeaderRefresh(); }}>
        //                 <View style={styles.footerContainer}>
        //                     <Text style={styles.footerText}>{footerEmptyDataText}</Text>
        //                 </View>
        //             </TouchableOpacity>
        //         );
        //     }
        //     case FooterRefreshState.NoMoreData: {
        //         return (
        //             <View style={styles.footerContainer} >
        //                 <Text style={styles.footerText}>
        //                     {footerNoMoreDataText}
        //                 </Text>
        //             </View>
        //         );
        //     }
        // }

        // return null;
    }

    render() {
        return (
            <FlatList
                {...this.props}
                ref={this.props.listRef}
                // scrollEventThrottle={16}
                onScroll={event => this._onScroll(event)}
                onMomentumScrollEnd={event => this._onMomentumScrollEnd(event)}
                onScrollEndDrag={event => this._onScrollEndDrag(event)}
                onScrollBeginDrag={event => this._onScrollBeginDrag(event)}
                onEndReached={this._onEndReached}
                ListHeaderComponent={this._renderHeader}
                ListFooterComponent={this._renderFooter}
                onEndReachedThreshold={0.1}
            />
        );
    }

    // /**
    //  * 手动调用下拉刷新
    //  */
    // beginRefresh() {
    //     this._headerBeginRefresh();
    // }

    // /**
    //  * 手动结束
    //  */
    // endRefresh() {
    //     this._headerEndRefresh();
    // }

    /**
     * 列表正在滚动
     * @private
     * @param {{}} event 
     */
    _onScroll(event) {
        this.offsetY = event.nativeEvent.contentOffset.y;
        console.log('_onScroll');
        console.log(this.state);
        console.log(this.offsetY);
        if (this.isDragging) {
            if (!this._isRefreshing()) {
                if (this.offsetY <= -this.headerHeight) {
                    // 松开以刷新
                    this.setState({ headerRefreshState: HeaderRefreshState.Pulling });
                    // Animated.timing(this.state.arrowAnimation, {
                    //     toValue: 1,
                    //     duration: 50,
                    //     easing: Easing.inOut(Easing.quad)
                    // }).start();
                } else {
                    // 下拉以刷新
                    this.setState({ headerRefreshState: HeaderRefreshState.Idle });
                    // Animated.timing(this.state.arrowAnimation, {
                    //     toValue: 0,
                    //     duration: 100,
                    //     easing: Easing.inOut(Easing.quad)
                    // }).start();
                }
            }
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
        console.log('_onScrollBeginDrag');
        console.log(this.state);
        console.log(this.offsetY);
    }

    _onScrollEndDrag(event) {
        this.isDragging = false;
        this.offsetY = event.nativeEvent.contentOffset.y;
        console.log('_onScrollEndDrag');
        console.log(this.state);
        console.log(this.offsetY);
        

        const { listRef, onHeaderRefresh } = this.props;

        if (!this._isRefreshing()) {
            if (this.state.headerRefreshState === HeaderRefreshState.Pulling) {
                this.refs[listRef].scrollToOffset({ animated: true, offset: -this.headerHeight });
                this.setState({ headerRefreshState: HeaderRefreshState.Refreshing });
                onHeaderRefresh && onHeaderRefresh();
            }
        } else {
            if (this.offsetY <= 0) {
                this.refs[listRef].scrollToOffset({ animated: true, offset: -this.headerHeight });
            }
        }   
    }
    /**
     * 列表结束拖拽
     * @private
     * @param {{}} event
     */
    _onMomentumScrollEnd(event) {
        this.offsetY = event.nativeEvent.contentOffset.y;
        console.log('_onMomentumScrollEnd');
        console.log(this.state);
        console.log(this.offsetY);
        // this.isDragging = false;
        // this.offsetY = event.nativeEvent.contentOffset.y;
        // console.log(this.state);
        // console.log(this.offsetY);
        

        // const { listRef, onHeaderRefresh } = this.props;

        // if (!this._isRefreshing()) {
        //     if (this.state.headerRefreshState === HeaderRefreshState.Pulling) {
        //         this.refs[listRef].scrollToOffset({ animated: true, offset: -this.headerHeight });
        //         this.setState({ headerRefreshState: HeaderRefreshState.Refreshing });
        //         onHeaderRefresh && onHeaderRefresh();
        //     }
        // } else {
        //     if (this.offsetY <= 0) {
        //         this.refs[listRef].scrollToOffset({ animated: true, offset: -this.headerHeight });
        //     }
        // }
    }

    /**
     * 列表是否正在刷新
     */
    _isRefreshing = () => {
        return (
            this.state.headerRefreshState === HeaderRefreshState.Refreshing &&
            this.props.footerRefreshState === FooterRefreshState.Refreshing
        );
    }

    /**
     * 头部刷新结束
     */
    _headerEndRefresh() {
        this.setState({ headerRefreshState: HeaderRefreshState.Idle });

        // Animated.timing(this.state.arrowAnimation, {
        //     toValue: 0,
        //     duration: 100,
        //     easing: Easing.inOut(Easing.quad)
        // }).start();

        const { listRef } = this.props;
        this.refs[listRef].scrollToOffset({ animated: true, offset: 0 });
    }

    // /**
    //  * 触发头部刷新
    //  */
    // _headerBeginRefresh = () => {
    //     const { onHeaderRefresh, listRef } = this.props;

    //     if (this._isRefreshing()) return;

    //     this.refs[listRef].scrollToOffset({ animated: true, offset: -this.headerHeight });

    //     this.setState({ headerRefreshState: HeaderRefreshState.Refreshing });

    //     onHeaderRefresh && onHeaderRefresh();
    // }

    /**
     * 触发加载更多
     */
    _onEndReached = () => {
        const { onFooterRefresh, data } = this.props;

        if (!this._isRefreshing() && !AppUtil.isEmptyArray(data)) {
            onFooterRefresh && onFooterRefresh();
        }
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
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

