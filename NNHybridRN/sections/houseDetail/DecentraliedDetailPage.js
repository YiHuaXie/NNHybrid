import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import NavigationUtil from '../../utils/NavigationUtil';
import HouseDetailNavigationBar from './HouseDetailNavigationBar';
import HouseDetailBannerCell from './HouseDetailBannerCell';
import HouseDetailRecommendCell from './HouseDetailRecommendCell';
import HouseDetailLocationCell from './HouseDetailLocationCell';
import HouseDetailServiceFacilityCell, { ItemsType } from './HouseDetailServiceFacilityCell';
import HouseDetailDescriptionCell from './HouseDetailDescriptionCell';
import HouseDetailMessageCell from './HouseDetailMessageCell';
import HouseDetailInfoCell from './HouseDetailInfoCell';
import NNPlaneLoading from '../../components/common/NNPlaneLoading';
import { connect } from 'react-redux';
import {
    init,
    navBarIsTransparent,
    loadData,
    DetailTypes,
    getStoreName,
} from '../../redux/houseDetail';
import Toaster from '../../components/common/Toaster';
import AppUtil from '../../utils/AppUtil';
import { Types } from '../../redux/base/actions';
import NativeUtil from '../../utils/NativeUtil';

const shareHandler = decentraliedHouse => {
    const { houseName, images } = decentraliedHouse;
    const title = houseName;
    const description = 'NNHybrid Share Descrption';
    const image = AppUtil.isEmptyArray(images) ? images[0] : null;
    const webUrl = 'http://www.baidu.com';
    const message = 'NNHybrid Share Meaasge';

    NativeUtil.share({ title, description, image, webUrl, message });
}

const mapViewDidTouched = decentraliedHouse => {
    const { houseName, address, latitude, longitude } = decentraliedHouse;

    NavigationUtil.goPage('AddressOnMapPage', {
        name: houseName,
        address,
        longitude,
        latitude
    });
}

class DecentraliedDetailPage extends Component {

    constructor(props) {
        super(props);

        this.state = { itemsType: ItemsType.FACILITY_PRIVATE };

        this.params = this.props.navigation.state.params;
        this.storeName = getStoreName(DetailTypes.Decentralied, this.params.roomId);

        this.props.init(this.storeName);
    }

    componentWillMount() {
        const { roomId, isFullRent } = this.params;

        this.props.loadData(
            DetailTypes.Decentralied,
            { roomId },
            this.storeName,
            error => Toaster.autoDisapperShow(error)
        );
    }

    componentWillUnmount() {
        NavigationUtil.dispatch(Types.HOUSE_DETAIL_WILL_UNMOUNT, this.storeName);
    }

    _renderContentView(decentraliedHouse, recommendHouseList) {
        const hasVR = !AppUtil.isEmptyString(decentraliedHouse.vrUrl);

        const facilityData =
            this.state.itemsType === ItemsType.FACILITY_PRIVATE ?
                decentraliedHouse.privateFacilityItems :
                decentraliedHouse.facilityItems;

        return (
            <ScrollView onScroll={e => (
                this.props.navBarIsTransparent(e.nativeEvent.contentOffset.y, this.storeName)
            )}>
                <HouseDetailBannerCell
                    data={decentraliedHouse.images}
                    hasVR={hasVR}
                    bannerItemClicked={(isVr) => {

                    }}
                />
                <HouseDetailInfoCell decentraliedHouse={decentraliedHouse} />
                <HouseDetailMessageCell decentraliedHouse={decentraliedHouse} />
                <HouseDetailServiceFacilityCell
                    data={facilityData}
                    itemsType={this.state.itemsType}
                    facilityChanged={itemsType => {
                        const newItemsType =
                            itemsType === ItemsType.FACILITY_PRIVATE ?
                                ItemsType.FACILITY_PUBLIC :
                                ItemsType.FACILITY_PRIVATE;

                        this.setState({ itemsType: newItemsType });
                    }}
                />
                <HouseDetailDescriptionCell description={decentraliedHouse.houseDesc} />
                <HouseDetailLocationCell
                    prefixAddress={decentraliedHouse.city + decentraliedHouse.region}
                    suffixAddress={decentraliedHouse.address}
                    mapViewDidTouched={() => mapViewDidTouched(decentraliedHouse)}
                    coordinate={{
                        address: decentraliedHouse.address,
                        longitude: decentraliedHouse.longitude,
                        latitude: decentraliedHouse.latitude
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
            </ScrollView >
        );
    }

    render() {
        const houseDetail = this.props.houseDetails[this.storeName];
        if (AppUtil.isEmptyObject(houseDetail)) return null;

        const { isTransparent, isLoading, decentraliedHouse, recommendHouseList } = houseDetail;

        return (
            <View style={styles.container}>
                {this._renderContentView(decentraliedHouse, recommendHouseList)}
                <HouseDetailNavigationBar
                    isTransparent={isTransparent}
                    title='房间详情'
                    backHandler={() => NavigationUtil.goBack()}
                    shareHandler={() => shareHandler(decentraliedHouse)}
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

export default connect(mapStateToProps, mapDispatchToProps)(DecentraliedDetailPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});