import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image
} from 'react-native';
import ApartmentNavigationBar from './ApartmentNavigationBar';
import NavigationUtil from '../../utils/NavigationUtil';
import ApartmentBannerCell from './ApartmentBannerCell';
import EachHouseCell from '../../components/common/EachHouseCell';
import AppUtil from '../../utils/AppUtil';
import { Types } from '../../redux/base/actions';

import { connect } from 'react-redux';
import { loadData, navBarIsTransparent } from '../../redux/apartment';
import Toaster from '../../components/common/Toaster';
import NNPlaneLoading from '../../components/common/NNPlaneLoading';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class ApartmentPage extends Component {

    componentWillMount() {
        const { loadData, navigation } = this.props;
        const { apartmentId, isTalent } = navigation.state.params;
        loadData({
            estateId: apartmentId,
            isTalent
        }, error => Toaster.autoDisapperShow(error));
    }

    componentWillUnmount() {
        NavigationUtil.dispatch(Types.APARTMENT_WILL_UNMOUNT);
    }

    _renderApartmentitems(data) {
        const tmp = [];
        for (const i in data) {
            tmp.push(
                <TouchableWithoutFeedback
                    key={i}
                    onPress={() => {
                        const { estateRoomTypeId, price } = data[i];
                        const params = { estateRoomTypeId, rentPrice: price };
                        NavigationUtil.goPage('CentraliedDetailPage', params);
                    }}>
                    <EachHouseCell apartment={data[i]} />
                </TouchableWithoutFeedback>
            );
        }
        return tmp;
    }

    render() {
        console.log(this.props.apartment);
        
        const { apartment, isTransparent, isLoading } = this.props.apartment;
        return (
            <View style={styles.container}>
                <ScrollView
                    onScroll={(e) => {
                        this.props.navBarIsTransparent(e.nativeEvent.contentOffset.y);
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
                    isTransparent={isTransparent}
                    backHandler={() => NavigationUtil.goBack()}
                />
                <NNPlaneLoading show={isLoading} />
            </View>
        );
    }
}

const mapStateToProps = state => ({ apartment: state.apartment });

const mapDispatchToProps = dispatch => ({
    loadData: params =>
        dispatch(loadData(params)),
    navBarIsTransparent: contentOffsetY =>
        dispatch(navBarIsTransparent(contentOffsetY))
});

export default connect(mapStateToProps, mapDispatchToProps)(ApartmentPage);

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