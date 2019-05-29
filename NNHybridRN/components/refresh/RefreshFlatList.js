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
import Refresher from '../common/Refresher';
import {
    HeaderRefreshState,
    FooterRefreshState,
    defaultHeaderProps,
    defaultFooterProps,
} from './RefreshConst';

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

export default class RefreshFlatList extends FlatList {

    static propTypes = {
        scrollViewRef: PropTypes.any,
        // Header相关属性
        headerRefreshState: PropTypes.string,

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
        // footerRefreshingComponent: PropTypes.func,
        // footerFailureComponent: PropTypes.func,
        // footerNoMoreDataComponent: PropTypes.func,
        // footerEmptyDataComponent: PropTypes.func,
    };

    static defaultProps = {
        // ref: 'flatList',
        scrollViewRef: 'scrollView',
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
            // refreshState: RefreshState.Idle,
            headerRefreshState: HeaderRefreshState.Idle
        };

    }

    /**
     * 加载下拉刷新组件
     */
    _renderHeader = () => {
        const { headerRefreshComponent } = this.props;
        const { arrowAnimation, headerRefreshState } = this.state;

        if (headerRefreshComponent) {
            return (
                <View style={{
                    ...styles.customHeader,
                    top: -this.headerHeight,
                    height: this.headerHeight
                }}>
                    {headerRefreshComponent(headerRefreshState, this.offsetY)}
                </View>
            );
        } else {
            return (
                <View style={{
                    ...styles.defaultHeader,
                    top: -this.headerHeight,
                    top: 0,
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

            footerRefreshingText,
            footerFailureText,
            footerNoMoreDataText,
            footerEmptyDataText,

            footerRefreshComponent,

            onHeaderRefresh,
            onFooterRefresh,
            data,
        } = this.props;

        if (footerRefreshComponent) {
            return footerRefreshComponent(footerRefreshState);
        }

        switch (footerRefreshState) {
            case FooterRefreshState.Idle: {
                return (
                    <View style={styles.footerContainer} />
                );
            }
            case FooterRefreshState.Refreshing: {
                return Refresher.footer(footerRefreshingText);
            }
            case FooterRefreshState.Failure: {
                const pressHandler = () => {
                    if (AppUtil.isEmptyArray(data)) {
                        onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
                    } else {
                        onFooterRefresh && onFooterRefresh(RefreshState.FooterRefreshing);
                    }
                };

                return (
                    <TouchableOpacity onPress={() => pressHandler()}>
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>{footerFailureText}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }
            case RefreshState.EmptyData: {
                const pressHandler = () => {
                    onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
                };

                return (
                    <TouchableOpacity onPress={() => pressHandler}>
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>{footerEmptyDataText}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }
            case RefreshState.NoMoreData: {
                return (
                    <View style={styles.footerContainer} >
                        <Text style={styles.footerText}>
                            {footerNoMoreDataText}
                        </Text>
                    </View>
                );
            }
        }

        return null;
    }

    render() {
        return (
            <FlatList
                {...this.props}
                scrollEventThrottle={16}
                onScroll={event => this._onScroll(event)}
                onScrollEndDrag={event => this._onScrollEndDrag(event)}
                onScrollBeginDrag={event => this._onScrollBeginDrag(event)}
                onEndReached={this.onEndReached}
                ListHeaderComponent={this._renderHeader}
                ListFooterComponent={this._renderFooter}
                onEndReachedThreshold={0.1}
            />
            // <ScrollView
            //     ref={this.props.scrollViewRef}
            //     {...this.props}
            //     scrollEventThrottle={16}
            //     onScroll={event => this._onScroll(event)}
            //     onScrollEndDrag={event => this._onScrollEndDrag(event)}
            //     onScrollBeginDrag={event => this._onScrollBeginDrag(event)}
            // >
            //     {this._renderRefreshHeader()}
            //     {this.props.children}
            // </ScrollView>
        );
    }

    /**
     * 手动调用下拉刷新
     */
    beginRefresh() {
        this._onHeaderRefresh();
    }

    /**
     * 手动结束
     */
    endRefresh() {
        this._headerRefreshEnd();
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
            if (this.state.headerRefreshState === HeaderRefreshState.Pulling) {
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
            this.state.headerRefreshState === HeaderRefreshState.Refreshing &&
            this.props.footerRefreshState !== FooterRefreshState.Refreshing
        );
    }

    _headerRefreshEnd() {
        // this.isRefreshing = false;

        this.setState({
            headerRefreshState: HeaderRefreshState.Idle,
        });

        // Animated.timing(this.state.arrowAnimation, {
        //     toValue: 0,
        //     duration: 100,
        //     easing: Easing.inOut(Easing.quad)
        // }).start();

        // const scrollView = this.refs[this.props.scrollViewRef];
        // scrollView.scrollTo({ y: 0, animated: true });
        this.refs.flatList.scrollTo({ y: 0, animated: true })
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
        // const { headerRefreshState } = this.state;

        
        if (this._isRefreshing()) {
            return;
        }

        this.setState({ headerRefreshState: HeaderRefreshState.Refreshing });

        // const scrollView = this.refs[this.props.scrollViewRef];
        // scrollView.scrollTo({ y: -this.headerHeight, animated: true });
        // this.refs.flatList.scrollTo({ y: -this.headerHeight, animated: true });
        this.scrollToOffset({offset: 200, animated: true});

        if (onHeaderRefresh) {
            onHeaderRefresh();
        } else {
            this._headerRefreshEnd();
        }
    }



    // onHeaderRefresh = () => {
    //     const { onHeaderRefresh } = this.props;

    //     if (this.headerShouldRefreshing()) {
    //         onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
    //     }
    // }

    _onEndReached = () => {
        const { onFooterRefresh, data } = this.props;

        if (!this._isRefreshing() && !AppUtil.isEmptyArray(data)) {
            onFooterRefresh && onFooterRefresh(FooterRefreshState.Refreshing);
        }
    }

    // headerShouldRefreshing = () => {
    //     const { refreshState } = this.props;

    //     if (refreshState === RefreshState.HeaderRefreshing ||
    //         refreshState === RefreshState.FooterRefreshing) {
    //         return false;
    //     }

    //     return true;
    // }

    // footerShouldRefreshing = () => {
    //     const { refreshState, data } = this.props;
    //     if (AppUtil.isEmptyArray(data)) {
    //         return false;
    //     }

    //     return refreshState === RefreshState.Idle;
    // }

    // renderFooter = () => {
    //     const {
    //         refreshState,

    //         footerRefreshingText,
    //         footerFailureText,
    //         footerNoMoreDataText,
    //         footerEmptyDataText,

    //         footerRefreshingComponent,
    //         footerFailureComponent,
    //         footerNoMoreDataComponent,
    //         footerEmptyDataComponent,

    //         onHeaderRefresh,
    //         onFooterRefresh,
    //         data,
    //     } = this.props;

    //     switch (refreshState) {
    //         case RefreshState.Idle:
    //             return (
    //                 <View style={styles.footerContainer} />
    //             );
    //         case RefreshState.Failure: {
    //             const pressHandler = () => {
    //                 if (AppUtil.isEmptyArray(data)) {
    //                     onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
    //                 } else {
    //                     onFooterRefresh && onFooterRefresh(RefreshState.FooterRefreshing);
    //                 }
    //             };

    //             const defaultFooterFailureComponent = (
    //                 <TouchableOpacity onPress={() => pressHandler()}>
    //                     <View style={styles.footerContainer}>
    //                         <Text style={styles.footerText}>{footerFailureText}</Text>
    //                     </View>
    //                 </TouchableOpacity>
    //             );

    //             return footerFailureComponent ? footerFailureComponent : defaultFooterFailureComponent;
    //         }
    //         case RefreshState.EmptyData: {
    //             const pressHandler = () => {
    //                 onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
    //             };

    //             const defaultFooterEmptyDataComponent = (
    //                 <TouchableOpacity onPress={() => pressHandler}>
    //                     <View style={styles.footerContainer}>
    //                         <Text style={styles.footerText}>{footerEmptyDataText}</Text>
    //                     </View>
    //                 </TouchableOpacity>
    //             );

    //             return footerEmptyDataComponent ? footerEmptyDataComponent : defaultFooterEmptyDataComponent;
    //         }
    //         case RefreshState.FooterRefreshing: {
    //             const defaultFooterRefreshingComponent = Refresher.footer(footerRefreshingText);
    //             return footerRefreshingComponent ? footerRefreshingComponent : defaultFooterRefreshingComponent;
    //         }
    //         case RefreshState.NoMoreData: {
    //             const defaultFooterNoMoreDataComponent = (
    //                 <View style={styles.footerContainer} >
    //                     <Text style={styles.footerText}>
    //                         {footerNoMoreDataText}
    //                     </Text>
    //                 </View>
    //             );

    //             return footerNoMoreDataComponent ? footerNoMoreDataComponent : defaultFooterNoMoreDataComponent;
    //         }
    //     }

    //     return null;
    // }

    // render() {
    //     const { renderItem, refreshState, headerRefreshingText, ...rest } = this.props;

    //     const refreshControl = Refresher.header({
    //         title: headerRefreshingText,
    //         refreshing: refreshState === RefreshState.HeaderRefreshing,
    //         onRefresh: this.onHeaderRefresh
    //     });

    //     return (
    //         <FlatList
    //             ref={this.props.listRef}
    //             onEndReached={this.onEndReached}
    //             refreshControl={refreshControl}
    //             // refreshing={refreshState === RefreshState.HeaderRefreshing}
    //             // onRefresh={this.onHeaderRefresh}
    //             ListFooterComponent={this.renderFooter}
    //             onEndReachedThreshold={0.1}
    //             renderItem={renderItem}
    //             {...rest}
    //         />
    //     );
    // }
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

