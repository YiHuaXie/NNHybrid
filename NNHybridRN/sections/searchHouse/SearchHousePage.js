import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import NavigationBar from '../../navigator/NavigationBar';
import NavigationUtil from '../../utils/NavigationUtil';
import SearchFilterMenu from './SearchFilterMenu';
import AppUtil from '../../utils/AppUtil';

import { connect } from 'react-redux';
import { loadData } from '../../redux/searchHouse';
import Toaster from '../../components/common/Toaster';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Refresher from '../../components/common/Refresher';
import EachHouseCell from '../../components/common/EachHouseCell';

class SearchHousePage extends Component {

    componentWillMount() {
        // const params = {
        //     cityId: '330100',
        //     fullRentType: '1',
        //     pageNo: 1,
        //     pageSize: 10,
        // }
        // this.props.loadData(params, error => Toaster.autoDisapperShow(error));
        this._loadData(true);
    }

    _renderHouseCell(item, index) {
        return (
            <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                    const { type, minRentPrice, id, isFullRent } = item;
                    const pageName = type === 1 ? 'CentraliedDetailPage' : 'DecentraliedDetailPage';
                    const params = type === 1 ? { estateRoomTypeId: id, rentPrice: minRentPrice } : { roomId: id, isFullRent };
                    NavigationUtil.goPage(pageName, params);
                }}>
                <EachHouseCell house={item} />
            </TouchableWithoutFeedback>
        );
    }

    _loadData(isRefresh) {
        const { loadData, currentPage } = this.props;

        const params = {
            cityId: '330100',
            fullRentType: '1'
        }

        loadData(params, isRefresh ? 1 : currentPage, error => Toaster.autoDisapperShow(error));
    }

    render() {
        const { searchHouse} = this.props;

        return (
            <View style={styles.container}>
                {/* 关于加载更多，FlatList会多次调用onEndReached函数，另外就是onMomentumScrollBegin的调用时机可能会比onEndReached来的晚*/}
                <FlatList
                    style={{ marginTop: AppUtil.fullNavigationBarHeight + 44 }}
                    showsHorizontalScrollIndicator={false}
                    data={searchHouse.houseList}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({ item, index }) => this._renderHouseCell(item, index)}
                    refreshControl={Refresher.header(searchHouse.isRefreshing, () => this._loadData(true))}
                    // ListFooterComponent={() => Refresher.footer(searchHouse.hideLoadingMore)}
                    // onEndReachedThreshold={0.5}
                    // onMomentumScrollBegin={() => this.canLoadMore = true}
                    // onEndReached={() => {
                    //     setTimeout(() => {
                    //         if (this.canLoadMore) {
                    //             this._loadData(false);
                    //             this.canLoadMore = false;
                    //         }
                    //     }, 100);
                    // }}
                />
                <NavigationBar
                    navBarStyle={{ position: 'absolute' }}
                    backOrCloseHandler={() => NavigationUtil.goBack()}
                    title='搜房'
                />
                <SearchFilterMenu style={styles.filterMenu} />

            </View>
        );
    }
}

const mapStateToProps = state => ({ searchHouse: state.searchHouse });

const mapDispatchToProps = dispatch => ({
    loadData: (params, currentPage, errorCallBack) =>
        dispatch(loadData(params, currentPage, errorCallBack)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchHousePage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    navigation: {
        position: 'absolute',
    },
    filterMenu: {
        backgroundColor: '#FFFFFF',
        height: 44,
        width: AppUtil.windowWidth,
        position: 'absolute',
        marginTop: AppUtil.fullNavigationBarHeight,
    }
});
