import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    Animated,
    Easing
} from 'react-native';
import { PropTypes } from 'prop-types';
import AppUtil from '../../utils/AppUtil';

const defaultHeaderHeight = 60.0;
const arrowImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABQBAMAAAD8TNiNAAAAJ1BMVEUAAACqqqplZWVnZ2doaGhqampoaGhpaWlnZ2dmZmZlZWVmZmZnZ2duD78kAAAADHRSTlMAA6CYqZOlnI+Kg/B86E+1AAAAhklEQVQ4y+2LvQ3CQAxGLSHEBSg8AAX0jECTnhFosgcjZKr8StE3VHz5EkeRMkF0rzk/P58k9rgOW78j+TE99OoeKpEbCvcPVDJ0OvsJ9bQs6Jxs26h5HCrlr9w8vi8zHphfmI0fcvO/ZXJG8wDzcvDFO2Y/AJj9ADE7gXmlxFMIyVpJ7DECzC9J2EC2ECAAAAAASUVORK5CYII=';

export const RefreshState = {
    Idle,
    HeaderPulling,
    HeaderRefreshing,
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

export default class RefreshScrollView extends Component {

    static propTypes = {
        scrollViewRef: PropTypes.any,

        onHeaderRefrsh: PropTypes.func,

        headerHeight: PropTypes.number,
        headerIdleText: PropTypes.string,
        headerPullingText: PropTypes.string,
        headerRefreshingText: PropTypes.string,

        headerRefreshComponent: PropTypes.func,
    }

    static defaultProps = {
        headerIdleText: '下拉可以刷新',
        headerPullingText: '松开立即刷新',
        headerRefreshingText: '正在刷新数据中...'
    }

    constructor(props) {
        super(props);

        const { headerHeight } = this.props;

        this.offsetY = 0;
        this.isDragging = false;
        this.headerHeight = headerHeight ? headerHeight : defaultHeaderHeight;

        this.state = {
            arrowAnimation: new Animated.Value(0),
            refreshState: RefreshState.Idle,
        };

    }

    componentWillMount() {

    }

    render() {
        return (
            <ScrollView
                ref={this.props.scrollViewRef}
                {...this.props}
                onScroll={() => { }}
            >
                {this._renderRefreshHeader()}
            </ScrollView>
        );
    }

    /**
     * 手动调用下拉刷新
     */
    beginRefresh() {

    }

    /**
     * 加载下拉刷新组件
     */
    _renderRefreshHeader = () => {
        const { headerRefreshComponent } = this.props;
        const { refreshState, arrowAnimation } = this.state;

        const customHeaderComponent = (
            <View style={{ ...styles.customHeader, top: -this.headerHeight, height: this.headerHeight }}>
                {headerRefreshComponent(refreshState, this.offsetY)}
            </View>
        );

        const arrowOrActivity = arrowOrActivityComponent(refreshState, arrowAnimation);
        const headerTitle = headerTitleComponent(refreshState);

        const defaultHeaderComponent = (
            <View style={{ ...styles.defaultHeader, top: -this.headerHeight, height: this.headerHeight }} >
                { arrowOrActivity }
                {headerTitle}
            </View >
        );

        return headerRefreshComponent ? customHeaderComponent : defaultHeaderComponent;
    }

    _onScroll(event) {
        let y = event.nativeEvent.contentOffset.y;
        this.offsetY = y;

        if (this.isDragging) {
            let height =
        }


        const { onScroll } = this.props;
        if (onScroll) onScroll(event);
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