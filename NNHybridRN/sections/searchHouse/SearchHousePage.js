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
import NNRefreshFlatList from '../../components/common/NNRefreshFlatList';
import EachHouseCell from '../../components/common/EachHouseCell';

class SearchHousePage extends Component {

    componentWillMount() {
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
        const { loadData, searchHouse } = this.props;

        const params = {
            cityId: '330100',
            fullRentType: '1'
        }

        loadData(params, isRefresh ? 1 : searchHouse.currentPage, error => Toaster.autoDisapperShow(error));
    }

    render() {
        const { searchHouse } = this.props;

        return (
            <View style={styles.container}>
                <NNRefreshFlatList
                    style={{ marginTop: AppUtil.fullNavigationBarHeight + 44 }}
                    showsHorizontalScrollIndicator={false}
                    data={searchHouse.houseList}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({ item, index }) => this._renderHouseCell(item, index)}
                    refreshState={searchHouse.refreshState}
                    onHeaderRefresh={() => this._loadData(true)}
                    onFooterRefresh={() => this._loadData(false)}
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
