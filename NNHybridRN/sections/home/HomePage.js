import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    DeviceEventEmitter,
    Alert
} from 'react-native';
import AppUtil from '../../utils/AppUtil';
import NavigationUtil from '../../utils/NavigationUtil';

import HomeNavigationBar from './HomeNavigationBar';
import HomeBannerModuleCell from './HomeBannerModuleCell';
import HomeMessageCell from './HomeMessageCell';
import HomeVRCell from './HomeVRCell';
import HomeApartmentCell from './HomeApartmentCell';
import HomeSectioHeader from './HomeSectionHeader';
import EachHouseCell from '../../components/common/EachHouseCell';
import HomeButtonCell from './HomeButtonCell';
import Refresher from '../../components/common/Refresher';
import Toaster from '../../components/common/Toaster';
import CityManager from '../city/CityManager';

import { connect } from 'react-redux';
import {
    loadData,
    selectedCityFinisedOrChanged,
    navBarIsTransparent,
    showCityLocationTip
} from '../../redux/home';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class HomePage extends Component {

    componentWillMount() {
        const { loadData, selectedCityFinisedOrChanged, showCityLocationTip } = this.props;

        CityManager.cityLocation((cityName, cityId) => {
            selectedCityFinisedOrChanged(cityName, cityId);
            loadData({ cityName, cityId });
        });

        DeviceEventEmitter.addListener('selectedCityChaged', ({ cityName, cityId }) => {
            selectedCityFinisedOrChanged(cityName, cityId);
            loadData({ cityName, cityId });
        });

        showCityLocationTip(locationCity => {
            Alert.alert(
                '',
                `定位到您在${locationCity.cityName}\n是否切换至该城市进行探索`,
                [
                    { text: '取消', style: 'cancel' },
                    {
                        text: '切换', onPress: () => {
                            selectedCityFinisedOrChanged(locationCity.cityName, locationCity.cityId);
                            loadData(locationCity);
                        }
                    }
                ],
                { cancelable: false }
            );
        });
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners();
    }

    _addDividingLine(add) {
        return add ? <View style={styles.dividingLine} /> : null;
    }

    _renderHouseitems(houses) {
        const tmpHouses = [];
        for (const i in houses) {
            tmpHouses.push(
                <TouchableWithoutFeedback
                    key={i}
                    onPress={() => {
                        const { type, minRentPrice, id, isFullRent } = houses[i];
                        const pageName = type === 1 ? 'CentraliedDetailPage' : 'DecentraliedDetailPage';
                        const params = type === 1 ? { estateRoomTypeId: id, rentPrice: minRentPrice } : { roomId: id, isFullRent };
                        NavigationUtil.goPage(pageName, params);
                    }}>
                    <EachHouseCell house={houses[i]} />
                </TouchableWithoutFeedback>
            );
        }

        return tmpHouses;
    }

    // 需要用SectionList实现
    render() {
        const { home, navBarIsTransparent } = this.props;
        const refreshHeader = Refresher.header(home.isLoading, () => this.props.loadData(home.cityId));

        if (home.error) { Toaster.autoDisapperShow(home.error); }
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={refreshHeader}
                    onScroll={e => navBarIsTransparent(e.nativeEvent.contentOffset.y)}
                >
                    <HomeBannerModuleCell
                        banners={home.banners}
                        modules={home.modules}
                    />
                    <HomeMessageCell messages={home.messages} />
                    <HomeVRCell vr={home.vr} />
                    {this._addDividingLine(!AppUtil.isEmptyArray(home.messages) || home.vr)}
                    {!AppUtil.isEmptyArray(home.apartments) ? <HomeSectioHeader title='品牌公寓' showMore={true} /> : null}
                    <HomeApartmentCell
                        apartments={home.apartments}
                        itemClick={(apartmentId, isTalent) => NavigationUtil.goPage('ApartmentPage', { apartmentId, isTalent })}
                    />
                    {!AppUtil.isEmptyArray(home.houses) ? <HomeSectioHeader title='猜你喜欢' showMore={false} /> : null}
                    {this._renderHouseitems(home.houses)}
                    {!AppUtil.isEmptyArray(home.houses) ? <HomeButtonCell /> : null}
                </ScrollView>
                <HomeNavigationBar
                    isTransparent={home.isTransparent}
                    cityName={home.cityName}
                    cityViewTouched={() => NavigationUtil.goPage('CityListPage')}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({ home: state.home });

const mapDispatchToProps = dispatch => ({
    loadData: selectedCity =>
        dispatch(loadData(selectedCity)),
    selectedCityFinisedOrChanged: (cityName, cityId) =>
        dispatch(selectedCityFinisedOrChanged(cityName, cityId)),
    navBarIsTransparent: contentOffsetY =>
        dispatch(navBarIsTransparent(contentOffsetY)),
    showCityLocationTip: callBack =>
        dispatch(showCityLocationTip(callBack))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    dividingLine: {
        height: 10,
        backgroundColor: AppUtil.app_dividing_line
    }
});
