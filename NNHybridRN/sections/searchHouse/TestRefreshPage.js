import React, { Component } from 'react';
import {
    SectionList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';

import RefreshScrollView, { RefreshState } from '../../components/refresh/RefreshScrollView';
import AppUtil from '../../utils/AppUtil';

export default class TestRefreshPage extends Component {

    state = { refreshState: RefreshState.Idle }

    _onRefresh() {
        this.setState({ refreshState: RefreshState.HeaderRefreshing });

        let timer = setTimeout(() => {
            clearTimeout(timer);
            alert('刷新成功');
            this.refs.scrollView.endRefresh();
        }, 1500);
    }

    render() {
        return (
            <RefreshScrollView
                onHeaderRefresh={this._onRefresh.bind(this)}
                // refreshState={this.state.refreshState}
                ref="scrollView"
            //其他你需要设定的属性(包括ScrollView的属性)
            >
                <View style={styles.content}>
                    <Text>下拉刷新ScrollView</Text>
                </View>
            </RefreshScrollView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        width: AppUtil.windowWidth,
        height: AppUtil.windowHeight,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    },
});