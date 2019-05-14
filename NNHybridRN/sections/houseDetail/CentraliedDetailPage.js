import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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
    init,
    loadData,
    navBarIsTransparent,
    DetailTypes,
    getStoreName
} from '../../redux/houseDetail';
import HouseDetailInfoCell from './HouseDetailInfoCell';
import NativeUtil from '../../utils/NativeUtil';

const shareHandler = centraliedHouse => {
    const { estateName, styleName, imageUrls } = centraliedHouse;

    const title = `${estateName}.${styleName}`;
    const description = 'NNHybrid Share Descrption';
    const image = AppUtil.isEmptyArray(imageUrls) ? imageUrls[0] : null;
    const webUrl = 'http://www.baidu.com';
    const message = 'NNHybrid Share Meaasge';

    NativeUtil.share({ title, description, image, webUrl, message });
}

const mapViewDidTouched = centraliedHouse => {
    const { estateName, address, latitude, longitude } = centraliedHouse;

    NavigationUtil.goPage('AddressOnMapPage', {
        name: estateName,
        address,
        longitude,
        latitude
    });
}

class CentraliedDetailPage extends Component {

    constructor(props) {
        super(props);

        this.params = this.props.navigation.state.params;
        this.storeName = getStoreName(DetailTypes.Centralied, this.params.estateRoomTypeId);

        this.props.init(this.storeName);
    }

    componentWillMount() {
        this.props.loadData(
            DetailTypes.Centralied,
            this.params,
            this.storeName,
            error => Toaster.autoDisapperShow(error)
        );
    }

    componentWillUnmount() {
        NavigationUtil.dispatch(Types.HOUSE_DETAIL_WILL_UNMOUNT, this.storeName);
    }

    _renderContentView(centraliedHouse, recommendHouseList) {
        const hasVR = !AppUtil.isEmptyString(centraliedHouse.vrUrl);

        return (
            <ScrollView onScroll={e => (
                this.props.navBarIsTransparent(e.nativeEvent.contentOffset.y, this.storeName)
            )}>
                <HouseDetailBannerCell
                    data={centraliedHouse.imageUrls}
                    hasVR={hasVR}
                    bannerItemClicked={(isVr) => {

                    }}
                />
                <HouseDetailInfoCell centraliedHouse={centraliedHouse} />
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
                    mapViewDidTouched={() => mapViewDidTouched(centraliedHouse)}
                    coordinate={{
                        address: centraliedHouse.address,
                        longitude: centraliedHouse.longitude,
                        latitude: centraliedHouse.latitude
                    }}
                />
                <HouseDetailRecommendCell
                    data={recommendHouseList}
                    recommendItemClick={index => {
                        const { type, minRentPrice, id, isFullRent } = recommendHouseList[index];
                        const pageName = type === 1 ? 'CentraliedDetailPage' : 'DecentraliedDetailPage';
                        const params = type === 1 ? { estateRoomTypeId: id, rentPrice: minRentPrice } : { roomId: id, isFullRent };
                        NavigationUtil.goPage(pageName, params);
                    }}
                />
            </ScrollView>
        );
    }

    render() {
        const houseDetail = this.props.houseDetails[this.storeName];
        if (AppUtil.isEmptyObject(houseDetail)) return null;

        const { isTransparent, isLoading, centraliedHouse, recommendHouseList } = houseDetail;
        return (
            <View style={styles.container}>
                {this._renderContentView(centraliedHouse, recommendHouseList)}
                <HouseDetailNavigationBar
                    isTransparent={isTransparent}
                    title='房型详情'
                    backHandler={() => NavigationUtil.goBack()}
                    shareHandler={() => shareHandler(centraliedHouse)}
                />
                <NNPlaneLoading show={isLoading} />
            </View>
        );
    }
}

const mapStateToProps = state => ({ houseDetails: state.houseDetails });

const mapDispatchToProps = dispatch => ({
    init: storeName => dispatch(init(storeName)),
    navBarIsTransparent: (contentOffsetY, storeName) =>
        dispatch(navBarIsTransparent(contentOffsetY, storeName)),
    loadData: (detailType, params, storeName, callBack) =>
        dispatch(loadData(detailType, params, storeName, callBack))
});

export default connect(mapStateToProps, mapDispatchToProps)(CentraliedDetailPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});