import React, { Component } from 'react';
import { StyleSheet, View, Text, SectionList } from 'react-native';
import NavigationBar from '../../navigator/NavigationBar';
import CityManager from './CityManager';
import PinYinUtil from '../../utils/PinYinUtil';
import AppUtil from '../../utils/AppUtil';

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

    async _loadData() {
        let locationCity = null;
        let visitedCities = null;

        try {
            locationCity = await CityManager.getLocationCity();
            visitedCities = await CityManager.getVisitedCities();
        } catch (e) { }

        const hotCities = CityManager.getHotCities();
        const sectionCityData = PinYinUtil.arrayWithFirstLetterFormat(CityManager.getHaveHouseCities(), element => {
            const adjustString = adjustCityNames[element.cityName];
            return adjustString ? adjustString : element.cityName;
        });
        const sectionTitles = this._getSectionTitles(sectionCityData);
        this.setState({
            locationCity,
            visitedCities,
            hotCities,
            sectionCityData,
            sectionTitles,
        });

        console.log(locationCity);
        console.log(visitedCities);
        console.log(hotCities);
        console.log(sectionCityData);
        console.log(sectionTitles);
    }

    _getSectionTitles = (data) => {
        const result = [];
        for (const i in data) {
            const { firstLetter } = data[i];
            result.push(firstLetter);
        }

        return result;
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <SectionList
                    renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={{ fontWeight: 'bold' }}>{title}</Text>
                    )}
                    sections={[
                        { title: 'Title1', data: ['item1', 'item2'] },
                        { title: 'Title2', data: ['item3', 'item4'] },
                        { title: 'Title3', data: ['item5', 'item6'] },
                    ]}
                    keyExtractor={(item, index) => item + index}
                />
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

class CityListCell extends Component {
    render() {
        return (
            <View style={styles.cellContent}>
                <Text style={styles.cellTitle}>
                    {this.props.title}
                </Text>
                <View style={styles.cellDividingLine} />
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
        backgroundColor: 'yellow',
    }
});