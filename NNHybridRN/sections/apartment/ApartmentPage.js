import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import ApartmentNavigationBar from './ApartmentNavigationBar';
import NavigationUtil from '../../utils/NavigationUtil';
import Network from '../../network';
import { ApiPath } from '../../network/ApiService';
import ApartmentBannerCell from './ApartmentBannerCell';
import EachHouseCell from '../../components/common/EachHouseCell';
import AppUtil from '../../utils/AppUtil';

export default class ApartmentPage extends Component {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            isTransparent: true,
            apartment: {},
        };

        this._loadData();
    }

    _loadData() {
        const { apartmentId, isTalent } = this.params;
        const parameters = { estateId: apartmentId, isTalent };
        Network
            .my_request(ApiPath.ESTATE, 'estateIntroduction', '3.6', parameters)
            .then(response => {
                console.log(response);
                this.setState({ apartment: response });
            })
            .catch(error => console.error(error));
    }

    _renderApartmentitems(data) {
        const tmp = [];
        for (const i in data) {
            tmp.push(
                <TouchableWithoutFeedback key={i}>
                    <EachHouseCell apartment={data[i]} />
                </TouchableWithoutFeedback>
            );
        }
        return tmp;
    }

    render() {
        const { apartment } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView
                    scrollEventThrottle={60}
                    onScroll={(e) => {
                        const offsetY = e.nativeEvent.contentOffset.y;
                        const isTransparent = offsetY <= AppUtil.fullNavigationBarHeight;
                        this.setState({ isTransparent });
                    }}
                >
                    <ApartmentBannerCell data={apartment.imageUrls} />
                    <Text style={styles.name}>{apartment.estateName}</Text>
                    <View style={styles.addressContainer}>
                        <Image
                            style={styles.addressIcon}
                            source={require('../../resource/images/location.png')}
                        />
                        <Text style={styles.address}>{apartment.address}</Text>
                    </View>
                    <View style={styles.dividingLine} />
                    <Text style={{ ...styles.sectionHeader }}>公寓简介</Text>
                    <Text numberOfLines={0} style={styles.description}>
                        {apartment.introduction}
                    </Text>
                    <View style={styles.dividingLine} />
                    <Text style={{ ...styles.sectionHeader, marginBottom: 5 }}>房型</Text>
                    {this._renderApartmentitems(apartment.estateRoomTypes)}
                </ScrollView>
                <ApartmentNavigationBar
                    isTransparent={this.state.isTransparent}
                    backHandler={() => NavigationUtil.goBack()}
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
    name: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        fontSize: 18,
        fontWeight: '400',
        color: AppUtil.app_black,
    },
    addressContainer: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 20,
        height: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    addressIcon: {
        width: 15,
        height: 15,
        resizeMode: 'cover',
        marginRight: 5
    },
    address: {
        fontSize: 12,
        color: AppUtil.app_gray
    },
    dividingLine: {
        marginLeft: 15,
        marginRight: 15,
        height: 0.5,
        backgroundColor: AppUtil.app_dividing_line
    },
    sectionHeader: {
        marginTop: 20,
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '400',
        color: AppUtil.app_black,
    },
    description: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        marginBottom: 20,
        color: AppUtil.app_black,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'auto'
    }
});