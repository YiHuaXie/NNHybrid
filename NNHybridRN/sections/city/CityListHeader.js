import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import AppUtil from '../../utils/AppUtil';

const locationCityHeight = 75;
const cityItemSpace = 10;
const cityItemSize = { width: (AppUtil.windowWidth - 50) / 3, height: 30 }
const cityItemsHeight = array => {
    if (AppUtil.isEmptyArray(array)) return 0;

    const row = Math.ceil(array.length / 3);
    return row * (cityItemSize.height + cityItemSpace);
};

export default class CityListHeader extends Component {

    _resetCityButton(buttonClick) {
        return (
            <TouchableWithoutFeedback onPress={() => buttonClick()}>
                <View style={styles.resetCityButton}>
                    <Image
                        style={{ width: 15, height: 15 }}
                        source={require('../../resource/images/location_reset.png')}
                    />
                    <Text style={{ fontSize: 12, color: AppUtil.app_theme }}>重新定位</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _cityItem({ key, city, itemStyle, cityItemClick }) {
        return (
            <TouchableWithoutFeedback
                key={key}
                onPress={() => cityItemClick()}
            >
                <View style={[styles.cityItem, itemStyle]}>
                    <Text style={{ fontSize: 14, color: AppUtil.app_black }}>
                        {city}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _sectionTitle(title) {
        return (
            <Text style={styles.sectionTitle}>{title}</Text>
        );
    }

    _renderLocationCity(locationCityName) {
        const locationCityTitle = this._sectionTitle('定位城市');
        const locationCityItem = this._cityItem({
            city: locationCityName,
            itemStyle: { marginLeft: 15 },
            cityItemClick: () => this.props.locationCityClick(locationCityName)
        });

        const resetCityButton = this._resetCityButton(() => this.props.resetCityClick());
        const viewStyle = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        };

        return (
            <View>
                {locationCityTitle}
                <View style={viewStyle}>
                    {locationCityItem}
                    {resetCityButton}
                </View>
            </View>
        );
    }

    _renderVisitedOrHotCities(title, data) {
        if (AppUtil.isEmptyArray(data)) return null;

        const items = data.map((item, index) => {
            return this._cityItem({
                city: item.cityName,
                key: index,
                itemStyle: {
                    marginLeft: index % 3 == 0 ? 15 : 10,
                    marginTop: index / 3 >= 1 ? 10 : 0,
                },
                cityItemClick: () => this.props.cityItemClick(item)
            });
        });

        return (
            <View style={{ marginTop: 10 }}>
                {this._sectionTitle(title)}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {items}
                </View>
            </View>
        );
    }

    static viewHeight({ visitedCities, hotCities }) {
        let height = locationCityHeight;
        if (!AppUtil.isEmptyArray(visitedCities)) {
            height += 35 + cityItemsHeight(visitedCities);
        }

        if (!AppUtil.isEmptyArray(hotCities)) {
            height += 35 + cityItemsHeight(hotCities);
        }

        return height;
    }

    render() {
        const { locationCityName, visitedCities, hotCities } = this.props;
        const viewHeight = CityListHeader.viewHeight({ visitedCities, hotCities });
        return (
            <View style={{ height: viewHeight }}>
                {this._renderLocationCity(locationCityName)}
                {this._renderVisitedOrHotCities('最近访问城市', visitedCities)}
                {this._renderVisitedOrHotCities('热门城市', hotCities)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cityItem: {
        width: cityItemSize.width,
        height: cityItemSize.height,
        backgroundColor: '#f5f6f6',
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#dddddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 10,
        fontSize: 13,
        color: AppUtil.app_gray,
    },
    resetCityButton: {
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 75,
        height: 15
    }
})