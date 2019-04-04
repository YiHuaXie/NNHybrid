import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import AppUtil from '../../utils/AppUtil';
import NavigationUtil from '../../utils/NavigationUtil';
import Network from '../../network';
import { ApiPath } from '../../network/ApiService';

import HomeBannerModuleCell from './HomeBannerModuleCell';
import HomeMessageCell from './HomeMessageCell';
import HomeVRCell from './HomeVRCell';
import HomeApartmentCell from './HomeApartmentCell';
import HomeSectioHeader from './HomeSectionHeader';
import EachHouseCell from '../../components/common/EachHouseCell';

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
        }

        this._loadData();
    }

    _loadData() {
        const iconListReq =
            Network.my_request(ApiPath.MARKET, 'iconList', '3.6.4', { cityId: '330100' });
        const houseListReq =
            Network.my_request(ApiPath.SEARCH, 'recommendList', '1.0', { cityId: '330100', sourceType: 1 });

        Promise
            .all([iconListReq, houseListReq])
            .then(([res1, res2]) => {
                console.log(res1);
                console.log(res2);
                this.setState({
                    banners: res1.focusPictureList,
                    modules: res1.iconList ? res1.iconList : [],
                    messages: res1.newsList,
                    vr: res1.marketVR,
                    apartments: res1.estateList,
                    houses: res2.resultList
                });
            })
            .catch(error => console.error(error));
    }

    _addDividingLine(add) {
        return add ? <View style={styles.dividingLine} /> : null;
    }

    _renderHouseitems() {
        const { houses } = this.state;

        tmpHouses = [];
        for (const i in houses) {
            tmpHouses.push(
                <TouchableWithoutFeedback key={i}>
                    <EachHouseCell house={houses[i]} />
                </TouchableWithoutFeedback>
            );
        }

        return tmpHouses;
    }

    // 需要用SectionList实现
    render() {
        const { banners, modules, messages, vr, apartments, houses } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <HomeBannerModuleCell
                        banners={banners}
                        modules={modules}
                    />
                    <HomeMessageCell messages={messages} />
                    <HomeVRCell vr={vr} />
                    {this._addDividingLine(!AppUtil.isEmptyArray(messages) || vr)}
                    {!AppUtil.isEmptyArray(apartments) ? <HomeSectioHeader title='品牌公寓' showMore={true} /> : null}
                    <HomeApartmentCell apartments={apartments} />
                    {!AppUtil.isEmptyArray(houses) ? <HomeSectioHeader title='猜你喜欢' showMore={false} /> : null}
                    {this._renderHouseitems()}
                </ScrollView>
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
