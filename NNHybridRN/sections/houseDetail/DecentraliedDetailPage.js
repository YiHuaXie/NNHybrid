import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import NavigationUtil from '../../utils/NavigationUtil';
import HouseDetailNavigationBar from './HouseDetailNavigationBar';
import HouseDetailBannerCell from './HouseDetailBannerCell';

import { connect } from 'react-redux';
import {
    loadDecentraliedDetail,
    navBarIsTransparent,
} from '../../redux/houseDetail';
import Toaster from '../../components/common/Toaster';
import AppUtil from '../../utils/AppUtil';
import { Types } from '../../redux/base/actions';

class DecentraliedDetailPage extends Component {

    componentWillMount() {
        const { loadDecentraliedDetail } = this.props;
        const { houseId, isFullRent } = this.props.navigation.state.params;

        loadDecentraliedDetail(houseId, error => Toaster.autoDisapperShow(error));
    }

    componentWillUnmount() {
        NavigationUtil.dispatch(Types.HOUSE_DETAIL_WILL_UNMOUNT);
    }

    render() {
        const { houseDetail, navBarIsTransparent } = this.props;
        const { decentraliedHouse, isTransparent, recommendHouseList } = houseDetail;
        const hasVR = !AppUtil.isEmptyString(decentraliedHouse.vrUrl);

        return (
            <View style={styles.container}>
                <ScrollView
                    onScroll={(e) => navBarIsTransparent(e.nativeEvent.contentOffset.y)}
                >
                    <HouseDetailBannerCell data={decentraliedHouse.images} hasVR={hasVR} />
                </ScrollView>
                <HouseDetailNavigationBar
                    isTransparent={isTransparent}
                    title='房间详情'
                    backHandler={() => NavigationUtil.goBack()}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    houseDetail: state.houseDetail
});

const mapDispatchToProps = dispatch => ({
    navBarIsTransparent: contentOffsetY =>
        dispatch(navBarIsTransparent(contentOffsetY)),
    loadDecentraliedDetail: (houseId, callBack) =>
        dispatch(loadDecentraliedDetail(houseId, callBack)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DecentraliedDetailPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    }
});