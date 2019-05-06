import React, { Component } from 'react';
import {
    SectionList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../../navigator/NavigationBar';
import AppUtil from '../../utils/AppUtil';
import CityManager from './CityManager';
import CityListHeader from './CityListHeader';
import NavigationUtil from '../../utils/NavigationUtil';
import { connect } from 'react-redux';
import { loadData, startLocation } from '../../redux/cityList';

class CityListPage extends Component {

    componentWillMount() {
        const { startLocation, loadData } = this.props;

        startLocation();
        loadData();
    }

    _selectCity(cityName, cityId) {
        DeviceEventEmitter.emit('selectedCityChaged', { cityName, cityId });
        NavigationUtil.goBack();
    }

    _locationCityClick(cityName) {
        if (cityName === '定位中...' || cityName === '无法获取') return;

        let finalCityName = null;
        let finalCityId = null;
        const data = CityManager.getHaveHouseCities();
        for (const i in data) {
            const city = data[i];
            if (cityName === city.cityName) {
                finalCityName = city.cityName;
                finalCityId = city.cityId;
                break;
            }
        }

        if (!finalCityName || !finalCityId) {
            Toaster.autoDisapperShow('所选城市暂未开通服务');
        } else {
            CityManager.saveLocationCity(finalCityName, finalCityId);
            this._selectCity(finalCityName, finalCityId);
        }
    }

    _renderListHeader() {
        const { locationCityName, visitedCities, hotCities } = this.props.cityList;
        return (
            <CityListHeader
                locationCityName={locationCityName}
                visitedCities={visitedCities}
                hotCities={hotCities}
                resetCityClick={() => this.props.startLocation()}
                cityItemClick={item => this._selectCity(item.cityName, `${item.cityId}`)}
                locationCityClick={cityName => this._locationCityClick(cityName)}
            />
        );
    }

    _renderListFooter() {
        return (
            <CityListSectionHeader
                title='更多城市敬请期待'
                titleStyle={{ textAlign: 'center' }}
            />
        );
    }

    render() {
        const { cityList } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SectionList
                    ref="sectionList"
                    style={{ marginTop: AppUtil.fullNavigationBarHeight }}
                    renderItem={({ item, index, section }) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => this._selectCity(item.cityName, `${item.cityId}`)}
                        >
                            <CityListCell
                                title={item.cityName}
                                lineHidden={index >= section.data.length - 1}
                            />
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section: { firstLetter } }) => (
                        <CityListSectionHeader title={firstLetter} />
                    )}
                    sections={cityList.sectionCityData}
                    keyExtractor={(item, index) => item + index}
                    ListHeaderComponent={this._renderListHeader()}
                    ListFooterComponent={this._renderListFooter()}
                />
                <NavigationBar
                    backOrClose='close'
                    backOrCloseHandler={() => NavigationUtil.goBack()}
                    title='选择城市'
                    showDividingLine={true}
                    navBarStyle={{ position: 'absolute' }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({ cityList: state.cityList });

const mapDispatchToProps = dispatch => ({
    loadData: () => dispatch(loadData()),
    startLocation: () => dispatch(startLocation()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CityListPage);

class CityListCell extends Component {
    render() {
        const { title, lineHidden } = this.props;
        return (
            <View style={styles.cellContent}>
                <Text style={styles.cellTitle}>{title}</Text>
                {!lineHidden ? <View style={styles.cellDividingLine} /> : null}
            </View>
        );
    }
}

class CityListSectionHeader extends Component {
    render() {
        return (
            <View style={{
                height: 35,
                backgroundColor: AppUtil.app_lightGray,
                justifyContent: 'center',
            }}>
                <Text style={{
                    marginLeft: 15,
                    fontSize: 15,
                    fontWeight: '500',
                    color: AppUtil.app_gray,
                    ... this.props.titleStyle,
                }}>
                    {this.props.title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    sectionTitle: {
        height: 35,
        fontSize: 15,
        fontWeight: '500',
        color: AppUtil.app_gray,
        backgroundColor: 'yellow',
    },
    cellContent: {
        height: 50,
        justifyContent: 'center',
    },
    cellDividingLine: {
        position: 'absolute',
        left: 15,
        right: 15,
        bottom: 0,
        height: 0.5,
        backgroundColor: AppUtil.app_dividing_line
    },
    cellTitle: {
        fontSize: 15,
        color: AppUtil.app_black,
        marginLeft: 15,
    }
});