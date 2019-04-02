import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AppUtil from '../../utils/AppUtil';
import NavigationUtil from '../../utils/NavigationUtil';
import Network from '../../network';
import { ApiPath } from '../../network/ApiService';

import HomeBannerModuleCell from './HomeBannerModuleCell';
import HomeMessageCell from './HomeMessageCell';
import HomeVRCell from './HomeVRCell';
import HomeApartmentCell from './HomeApartmentCell';

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            banners: [],
            modules: [],
            messages: [],
            vr: null,
            apartments: [],
        }

        this._loadData();
    }

    _loadData() {
        Network
            .my_request(ApiPath.MARKET, 'iconList', '3.6.4', { cityId: '330100' })
            .then(response => {
                console.log(response);
                this.setState({
                    banners: response.focusPictureList,
                    modules: response.iconList,
                    messages: response.newsList,
                    vr: response.marketVR,
                    apartments: response.estateList
                });
            })
            .catch(error => console.error(error));
    }

    _addDividingLine(add) {
        return add ? <View style={styles.dividingLine} /> : null;
    }

    // 需要用SectionListshixian
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <HomeBannerModuleCell
                        banners={this.state.banners}
                        modules={this.state.modules}
                    />
                    <HomeMessageCell messages={this.state.messages} />
                    <HomeVRCell vr={this.state.vr} />
                    {this._addDividingLine(this.state.messages.length || this.state.vr)}
                    <HomeApartmentCell apartments={this.state.apartments}/>
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
