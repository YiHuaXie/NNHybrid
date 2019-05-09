import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import NavigationUtil from '../../utils/NavigationUtil';
import HouseDetailBannerCell from './HouseDetailBannerCell';
import HouseDetailNavigationBar from './HouseDetailNavigationBar';
import HouseDetailRecommendCell from './HouseDetailRecommendCell';
import HouseDetailLocationCell from './HouseDetailLocationCell';
import HouseDetailServiceFacilityCell, { ItemsType } from './HouseDetailServiceFacilityCell';
import HouseDetailMessageCell from './HouseDetailMessageCell';
import NNPlaneLoading from '../../components/common/NNPlaneLoading';
import AppUtil from '../../utils/AppUtil';
import Toaster from '../../components/common/Toaster';
import { Types } from '../../redux/base/actions';
import { connect } from 'react-redux';
import {
    loadData,
    navBarIsTransparent,
    DetailTypes
} from '../../redux/houseDetail';
import HouseDetailInfoCell from './HouseDetailInfoCell';

class CentraliedDetailPage extends Component {

    componentWillMount() {
        const { estateRoomTypeId, rentPrice } = this.props.navigation.state.params;
        this.props.loadData(
            DetailTypes.Centralied,
            { estateRoomTypeId, rentPrice },
            error => Toaster.autoDisapperShow(error)
        );
    }

    componentWillUnmount() {
        NavigationUtil.dispatch(Types.HOUSE_DETAIL_WILL_UNMOUNT);
    }

    _renderContentView() {
        const { houseDetail, navBarIsTransparent } = this.props;
        const { centraliedHouse, recommendHouseList } = houseDetail;

        if (AppUtil.isEmptyObject(centraliedHouse)) return null;

        const hasVR = !AppUtil.isEmptyString(centraliedHouse.vrUrl);

        return (
            <ScrollView
                onScroll={(e) => navBarIsTransparent(e.nativeEvent.contentOffset.y)}
            >
                <HouseDetailBannerCell
                    data={centraliedHouse.imageUrls}
                    hasVR={hasVR}
                    bannerItemClicked={(isVr) => {

                    }}
                />
                <HouseDetailInfoCell centraliedHouse={centraliedHouse}/>
                <HouseDetailMessageCell centraliedHouse={centraliedHouse} />
                <HouseDetailServiceFacilityCell
                    data={centraliedHouse.services}
                    itemsType={ItemsType.SERVICE_PRIVATE}
                />
                <HouseDetailServiceFacilityCell
                    data={centraliedHouse.storeServices}
                    itemsType={ItemsType.SERVICE_PUBLIC}
                />
                <HouseDetailLocationCell
                    suffixAddress={centraliedHouse.address}
                    longitude={centraliedHouse.longitude}
                    latitude={centraliedHouse.latitude}
                />
                <HouseDetailRecommendCell
                    data={recommendHouseList}
                    recommendItemClicked={index => {

                    }}
                />
            </ScrollView>
        );
    }

    render() {
        const { isTransparent, isLoading } = this.props.houseDetail;
        return (
            <View style={styles.container}>
                {this._renderContentView()}
                <HouseDetailNavigationBar
                    isTransparent={isTransparent}
                    title='房型详情'
                    backHandler={() => NavigationUtil.goBack()}
                    shareHandler={() => {

                    }}
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

export default connect(mapStateToProps, mapDispatchToProps)(CentraliedDetailPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});