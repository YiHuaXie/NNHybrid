import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import NavigationUtil from '../../utils/NavigationUtil';
import HouseDetailNavigationBar from './HouseDetailNavigationBar';
import HouseDetailBannerCell from './HouseDetailBannerCell';
import HouseDetailRecommendCell from './HouseDetailRecommendCell';
import HouseDetailLocationCell from './HouseDetailLocationCell';
import HouseDetailServiceFacilityCell, { ItemsType } from './HouseDetailServiceFacilityCell';
import NNPlaneLoading from '../../components/common/NNPlaneLoading';
import { connect } from 'react-redux';
import {
    navBarIsTransparent,
    loadData,
    DetailTypes
} from '../../redux/houseDetail';
import Toaster from '../../components/common/Toaster';
import AppUtil from '../../utils/AppUtil';
import { Types } from '../../redux/base/actions';

class DecentraliedDetailPage extends Component {

    componentWillMount() {
        const { roomId, isFullRent } = this.props.navigation.state.params;

        this.props.loadData(
            DetailTypes.Decentralied,
            { roomId },
            error => Toaster.autoDisapperShow(error)
        );
    }

    componentWillUnmount() {
        NavigationUtil.dispatch(Types.HOUSE_DETAIL_WILL_UNMOUNT);
    }

    _renderContentView() {
        const { houseDetail, navBarIsTransparent } = this.props;
        const { decentraliedHouse, recommendHouseList } = houseDetail;

        if (AppUtil.isEmptyObject(decentraliedHouse)) return null;

        const hasVR = !AppUtil.isEmptyString(decentraliedHouse.vrUrl);

        return (
            <ScrollView onScroll={(e) => navBarIsTransparent(e.nativeEvent.contentOffset.y)}>
                <HouseDetailBannerCell
                    data={decentraliedHouse.images}
                    hasVR={hasVR}
                    bannerItemClicked={(isVr) => {

                    }}
                />
                <HouseDetailServiceFacilityCell
                    title='房间设施'
                    data={decentraliedHouse.privateFacilityItems}
                    itemType={ItemsType.Facility}
                />
                <HouseDetailServiceFacilityCell
                    title='公共设施'
                    data={decentraliedHouse.facilityItems}
                    itemType={ItemsType.Facility}
                />
                <HouseDetailLocationCell
                    prefixAddress={decentraliedHouse.city + decentraliedHouse.region}
                    suffixAddress={decentraliedHouse.address}
                    longitude={decentraliedHouse.longitude}
                    latitude={decentraliedHouse.latitude}
                />
                <HouseDetailRecommendCell
                    data={recommendHouseList}
                    recommendItemClicked={index => {

                    }}
                />
            </ScrollView >
        );
    }

    render() {
        const { isTransparent, isLoading } = this.props.houseDetail;

        return (
            <View style={styles.container}>
                {this._renderContentView()}
                <HouseDetailNavigationBar
                    isTransparent={isTransparent}
                    title='房间详情'
                    backHandler={() => NavigationUtil.goBack()}
                />
                <NNPlaneLoading show={isLoading} />
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
    loadData: (detailType, params, callBack) =>
        dispatch(loadData(detailType, params, callBack))
});

export default connect(mapStateToProps, mapDispatchToProps)(DecentraliedDetailPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});