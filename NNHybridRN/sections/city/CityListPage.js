import React, { Component } from 'react';
import {
    SectionList,
    StyleSheet,
    Text,
    View,
    NativeModules,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../../navigator/NavigationBar';
import AppUtil from '../../utils/AppUtil';
import PinYinUtil from '../../utils/PinYinUtil';
import CityManager from './CityManager';
import CityListHeader from './CityListHeader';
import NavigationUtil from '../../utils/NavigationUtil';

const AMapLocation = NativeModules.AMapLocationModule;

const adjustCityNames = {
    '长沙市': '厂沙市',
    '长春市': '厂春市',
    '长治市': '厂治市',
    '厦门市': '下门市',
    '重庆市': '虫庆市',
};

export default class CityListPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            locationCity: {},
            locationCityName: '定位中...',
            visitedCities: [],
            hotCities: [],
            sectionCityData: [],
            sectionTitles: []
        };
    }

    componentWillMount() {
        this._startLocation();
        this._loadData();
    }

    _startLocation() {
        this.setState({ locationCityName: '定位中...' });

        AMapLocation.locationWithCompletion(({ error, city, provice }) => {
            let locationCityName = '无法获取';
            if (!error) {
                locationCityName = city;
                if (!locationCityName.length) locationCityName = provice;
            }

            this.setState({ locationCityName });
        });
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
            this._selectCity(finalCityName, finalCityId);
        }
    }

    async _loadData() {
        let visitedCities = null;

        try {
            visitedCities = await CityManager.getVisitedCities();
        } catch (e) { }

        const hotCities = CityManager.getHotCities();
        const sectionCityData = PinYinUtil.arrayWithFirstLetterFormat(CityManager.getHaveHouseCities(), element => {
            const adjustString = adjustCityNames[element.cityName];
            return adjustString ? adjustString : element.cityName;
        });
        const sectionTitles = this._getSectionTitles(sectionCityData);
        this.setState({
            visitedCities,
            hotCities,
            sectionCityData,
            sectionTitles,
        });
    }

    _getSectionTitles = (data) => {
        const result = [];
        for (const i in data) {
            const { firstLetter } = data[i];
            result.push(firstLetter);
        }

        return result;
    }

    // // 点击右侧字母滑动到相应位置
    // _scrollToList(item, index) {
    //     let position = 0;
    //     for (let i = 0; i < index; i++) {
    //         position += totalHeight[i]
    //     }
    //     this.refs.ScrollView.scrollTo({ y: position })
    // }

    // _renderSideSectionView() {
    //     const sectionItem = cityDatas.map((item, index) => {
    //         return (
    //             <Text onPress={() => this.scrollToList(item, index)}
    //                 key={index} style={{ textAlign: 'center', alignItems: 'center', height: sectionItemHeight, lineHeight: sectionItemHeight, color: '#C49225' }}>
    //                 {item.title}
    //             </Text>)
    //     });

    //     return (
    //         <View style={{
    //             position: 'absolute',
    //             width: 20,
    //             height: height - sectionTopBottomHeight * 2,
    //             right: 5,
    //             marginTop: sectionTopBottomHeight,
    //             marginBottom: sectionTopBottomHeight,
    //         }}
    //             ref="sectionItemView"
    //         >
    //             {sectionItem}
    //         </View>
    //     );
    // }

    _renderListHeader() {
        const { locationCityName, visitedCities, hotCities } = this.state;
        return (
            <CityListHeader
                locationCityName={locationCityName}
                visitedCities={visitedCities}
                hotCities={hotCities}
                resetCityClick={() => this._startLocation()}
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
                    sections={this.state.sectionCityData}
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
    },
    // indexList: {
    //     position: 'absolute',
    //     width: 20,
    //     height: AppUtil.windowHeight - sectionTopBottomHeight * 2,
    //     right: 5,
    //     top: 0,
    //     marginTop: sectionTopBottomHeight,
    //     marginBottom: sectionTopBottomHeight,
    // }
});