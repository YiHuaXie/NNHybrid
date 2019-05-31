import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import NavigationBar from '../../navigator/NavigationBar';
import NavigationUtil from '../../utils/NavigationUtil';
import SearchFilterMenu, { FilterMenuType } from './SearchFilterMenu';
import AppUtil from '../../utils/AppUtil';
import { Types } from '../../redux/base/actions';
import { connect } from 'react-redux';
import { loadData } from '../../redux/searchHouse';
import Toaster from '../../components/common/Toaster';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import RefreshFlatList from '../../components/refresh/RefreshFlatList';
import EachHouseCell from '../../components/common/EachHouseCell';
import PlaceholderView from '../../components/common/PlaceholderView';
import { FooterRefreshState } from '../../components/refresh/RefreshConst';


class TestRefreshPage extends Component {

    constructor(props) {
        super(props);

        this.params = this.props.navigation.state.params;

        if (!this.params['filterMenuType']) {
            this.params.filterMenuType = FilterMenuType.NONE;
        }

        this.filterParams = {
            cityId: this.props.home.cityId,
            fullRentType: '1'
        };
    }

    componentDidMount() {
        this._loadData(true);
    }

    componentWillUnmount() {
        NavigationUtil.dispatch(Types.SEARCH_HOUSE_WILL_UNMOUNT2);
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
        const currentPage = isRefresh ? 1 : searchHouse.currentPage;

        loadData(this.filterParams, currentPage, error => Toaster.autoDisapperShow(error));
    }

    footerRefreshComponent(footerRefreshState, data) {
        switch (footerRefreshState) {
            case FooterRefreshState.Failure: {
                return AppUtil.isEmptyArray(data) ? (
                    <PlaceholderView
                        height={AppUtil.windowHeight - AppUtil.fullNavigationBarHeight - 44}
                        imageSource={require('../../resource/images/placeHolder/placeholder_error.png')}
                        tipText='出了点小问题'
                        needReload={true}
                        reloadHandler={() => this._loadData(true)}
                    />
                ) : null;
            }
            case FooterRefreshState.EmptyData: {
                return (
                    <PlaceholderView
                        height={AppUtil.windowHeight - AppUtil.fullNavigationBarHeight - 44}
                        imageSource={require('../../resource/images/placeHolder/placeholder_house.png')}
                        tipText='真的没了'
                        infoText='更换筛选条件试试吧'
                    />
                );
            }
            default:
                return null;
        }
    }

    render() {
        const { home, searchHouse } = this.props;

        return (
            <View style={styles.container} ref='container'>
                <RefreshFlatList
                    ref='flatList'
                    style={{ marginTop: AppUtil.fullNavigationBarHeight + 44 }}
                    showsHorizontalScrollIndicator={false}
                    data={searchHouse.houseList}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({ item, index }) => this._renderHouseCell(item, index)}
                    headerIsRefreshing={searchHouse.headerIsRefreshing}
                    footerRefreshState={searchHouse.footerRefreshState}
                    onHeaderRefresh={() => this._loadData(true)}
                    onFooterRefresh={() => this._loadData(false)}
                    footerRefreshComponent={footerRefreshState => this.footerRefreshComponent(footerRefreshState, searchHouse.houseList)}
                />
                <NavigationBar
                    navBarStyle={{ position: 'absolute' }}
                    backOrCloseHandler={() => NavigationUtil.goBack()}
                    title='搜房'
                />
                <SearchFilterMenu
                    style={styles.filterMenu}
                    cityId={`${home.cityId}`}
                    subwayData={home.subwayData}
                    containerRef={this.refs.container}
                    filterMenuType={this.params.filterMenuType}
                    onChangeParameters={() => this._loadData(true)}
                    onUpdateParameters={({ nativeEvent: { filterParams } }) => {
                        this.filterParams = {
                            ...this.filterParams,
                            ...filterParams,
                        };
                    }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({ home: state.home, searchHouse: state.searchHouse2 });

const mapDispatchToProps = dispatch => ({
    loadData: (params, currentPage, errorCallBack) =>
        dispatch(loadData(params, currentPage, errorCallBack)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TestRefreshPage);

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