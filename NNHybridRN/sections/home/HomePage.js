import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableWithoutFeedback,
    StatusBar,
    NativeModules
} from 'react-native';
import AppUtil from '../../utils/AppUtil';
import NavigationUtil from '../../utils/NavigationUtil';

import Network from '../../network';
import { ApiPath } from '../../network/ApiService';

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

const CityManager = NativeModules.CityManagerModule;

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            banners: [],
            modules: [],
            messages: [],
            vr: null,
            apartments: [],
            houses: [],
            isTransparent: true,
            cityName: '定位中...',
            cityId: '330100',
            isLoading: true
        }

        this._loadData();

        CityManager.cityLocation((cityName, cityId) => {
            this.setState({ cityName, cityId, isLoading: true });
            this._loadData();
        });
    }

    _loadData() {
        const iconListReq =
            Network.my_request(ApiPath.MARKET, 'iconList', '3.6.4', { cityId: this.state.cityId });
        const houseListReq =
            Network.my_request(ApiPath.SEARCH, 'recommendList', '1.0', { cityId: this.state.cityId, sourceType: 1 });

        Promise
            .all([iconListReq, houseListReq])
            .then(([res1, res2]) => {
                // console.log(res1);
                // console.log(res2);
                this.setState({
                    banners: res1.focusPictureList,
                    modules: res1.iconList,
                    messages: res1.newsList,
                    vr: res1.marketVR,
                    apartments: res1.estateList,
                    houses: res2.resultList,
                    isLoading: false
                });
            })
            .catch(error => {
                this.setState({ isLoading: false });
                Toaster.autoDisapperShow(error.message);
            });
    }

    _addDividingLine(add) {
        return add ? <View style={styles.dividingLine} /> : null;
    }

    _renderHouseitems() {
        const { houses } = this.state;

        const tmpHouses = [];
        for (const i in houses) {
            tmpHouses.push(
                <TouchableWithoutFeedback key={i}>
                    <EachHouseCell house={houses[i]}/>
                </TouchableWithoutFeedback>
            );
        }

        return tmpHouses;
    }

    _statusBar() {
        const { isTransparent } = this.state;
        if (AppUtil.iOS) {
            return <StatusBar barStyle={isTransparent ? 'light-content' : 'default'} />
        }
    }

    // 需要用SectionList实现
    render() {
        const { isLoading, banners, modules, messages, vr, apartments, houses } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={Refresher.header(isLoading, () => this._loadData())}
                    // scrollEventThrottle={60}
                    onScroll={(e) => {
                        this.setState({
                            isTransparent: e.nativeEvent.contentOffset.y > 100 ? false : true
                        })
                    }}
                >
                    <HomeBannerModuleCell
                        banners={banners}
                        modules={modules}
                    />
                    <HomeMessageCell messages={messages} />
                    <HomeVRCell vr={vr} />
                    {this._addDividingLine(!AppUtil.isEmptyArray(messages) || vr)}
                    {!AppUtil.isEmptyArray(apartments) ? <HomeSectioHeader title='品牌公寓' showMore={true} /> : null}
                    <HomeApartmentCell
                        apartments={apartments}
                        itemClick={(apartmentId, isTalent) => NavigationUtil.goPage('ApartmentPage', {apartmentId, isTalent})}
                    />
                    {!AppUtil.isEmptyArray(houses) ? <HomeSectioHeader title='猜你喜欢' showMore={false} /> : null}
                    {this._renderHouseitems()}
                    {!AppUtil.isEmptyArray(houses) ? <HomeButtonCell /> : null}
                </ScrollView>
                {this._statusBar()}
                <HomeNavigationBar
                    isTransparent={this.state.isTransparent}
                    cityName={this.state.cityName}
                />
            </View>
        );
    }
}

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
