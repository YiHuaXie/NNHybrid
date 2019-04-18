import React, { Component } from 'react';
import { View, Text } from 'react-native';
import NavigationBar from '../../navigator/NavigationBar';
import CityManager from './CityManager';
import PinYinUtil from '../../utils/PinYinUtil';

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
            visitedCities: [],
            hotCities: [],
            sectionCityData: [],
            sectionTitles: []
        };
    }

    componentWillMount() {
        this._loadData();
    }

    _loadData() {
        const locationCity = CityManager.getLocationCity();
        const visitedCities = CityManager.getVisitedCities();
        const hotCities = CityManager.getHotCities();
        const sectionCityData = PinYinUtil.arrayWithFirstLetterFormat(CityManager.getHaveHouseCities(), element => {
            const adjustString = adjustCityNames[element.cityName];
            return adjustString ? adjustString : element.cityName;
        });

        this.setState({
            locationCity,
            visitedCities,
            hotCities,
            sectionCityData,
            sectionTitles: this._getSectionTitles(sectionCityData),
        });
    }

    _getSectionTitles = (data) => {
        const result = [];
        for (const i in data) {
            result.push((data[i]).firstLetter);
        }

        return result;
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <Text
                    style={{ fontSize: 20, textAlign: 'center', margin: 10 }}
                    onPress={() => {
                    }}
                >
                    CityListPage
                </Text>
                <NavigationBar
                    backOrClose='close'
                    title='选择城市'
                    showDividingLine={true}
                    navBarStyle={{ position: 'absolute' }}
                />
            </View>
        );
    }
}