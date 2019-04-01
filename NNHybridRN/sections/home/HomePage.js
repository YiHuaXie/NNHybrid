import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AppUtil from '../../utils/AppUtil';
import NavigationUtil from '../../utils/NavigationUtil';
import Network from '../../network';
import { ApiPath } from '../../network/ApiService';

import HomeBannerModuleCell from './HomeBannerModuleCell';

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            banner: []
        }

        this._loadData();
    }

    _loadData() {
        Network
            .my_request(ApiPath.MARKET, 'iconList', '3.6.4', { cityId: '330100' })
            .then(response => {
                console.log(response);
                this.setState({ banner: response.focusPictureList })
            })
            .catch(error => console.error(error));
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <HomeBannerModuleCell
                        banner={this.state.banner}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppUtil.app_theme
    }
});
