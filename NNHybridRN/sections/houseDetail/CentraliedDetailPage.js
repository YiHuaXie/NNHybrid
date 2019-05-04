import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import NavigationUtil from '../../utils/NavigationUtil';
import HouseDetailBannerCell from './HouseDetailBannerCell';
import HouseDetailNavigationBar from './HouseDetailNavigationBar';
import NNPlaneLoading from '../../components/common/NNPlaneLoading';
import { connect } from 'react-redux';
import {
    loadData,
    navBarIsTransparent,
    DetailTypes
} from '../../redux/houseDetail';


class CentraliedDetailPage extends Component {

    componentWillMount() {
        const { houseId, rentPrice } = this.props.navigation.state.params;

        this.props.loadData(
            DetailTypes.Centralied,
            { roomId: houseId, rentPrice},
            error => Toaster.autoDisapperShow(error)
        );
    }

    componentWillUnmount() {
        NavigationUtil.dispatch(Types.HOUSE_DETAIL_WILL_UNMOUNT);
    }

    render() {
        const { houseDetail, navBarIsTransparent } = this.props;
        const { centraliedHouse, isTransparent, recommendHouseList, isLoading } = houseDetail;
        const hasVR = !AppUtil.isEmptyString(decentraliedHouse.vrUrl);

        return (
            <View style={styles.container}>
                <ScrollView
                    onScroll={(e) => navBarIsTransparent(e.nativeEvent.contentOffset.y)}
                >
                    <HouseDetailBannerCell
                        data={centraliedHouse.images}
                        hasVR={hasVR}
                        bannerItemClicked={(isVr) => {

                        }}
                    />
                </ScrollView>
                <HouseDetailNavigationBar
                    isTransparent={isTransparent}
                    title='房型详情'
                    backHandler={() => NavigationUtil.goBack()}
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

export default connect(mapStateToProps, mapDispatchToProps)(CentraliedDetailPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});