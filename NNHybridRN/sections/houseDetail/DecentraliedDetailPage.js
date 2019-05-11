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
    navBarIsTransparent,
    loadData,
    DetailTypes
} from '../../redux/houseDetail';
import Toaster from '../../components/common/Toaster';
import AppUtil from '../../utils/AppUtil';
import { Types } from '../../redux/base/actions';
import NativeUtil from '../../utils/NativeUtil';

const shareHandler = (decentraliedHouse) => {
    const { houseName, images } = decentraliedHouse;
    const title = houseName;
    const description = 'NNHybrid Share Descrption';
    const image = AppUtil.isEmptyArray(images) ? images[0] : null;
    const webUrl = 'http://www.baidu.com';
    const message = 'NNHybrid Share Meaasge';

    NativeUtil.share({ title, description, image, webUrl, message });
}

const mapViewDidTouched = (decentraliedHouse) => {
    const { houseName, address, latitude, longitude } = decentraliedHouse;

    NavigationUtil.goPage('AddressOnMapPage', {
        name: houseName,
        address,
        longitude,
        latitude
    });
}

class DecentraliedDetailPage extends Component {

    state = { itemsType: ItemsType.FACILITY_PRIVATE };

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

        const facilityData =
            this.state.itemsType === ItemsType.FACILITY_PRIVATE ?
                decentraliedHouse.privateFacilityItems :
                decentraliedHouse.facilityItems;

        return (
            <ScrollView onScroll={(e) => navBarIsTransparent(e.nativeEvent.contentOffset.y)}>
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
                    recommendItemClicked={index => {

                    }}
                />
            </ScrollView >
        );
    }

    render() {
        const { isTransparent, isLoading, decentraliedHouse } = this.props.houseDetail;

        return (
            <View style={styles.container}>
                {this._renderContentView()}
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