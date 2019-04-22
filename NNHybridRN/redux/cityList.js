import { NativeModules } from 'react-native';
import { Types } from './base/actions';
import PinYinUtil from '../utils/PinYinUtil';
import CityManager from '../sections/city/CityManager';

const AMapLocation = NativeModules.AMapLocationModule;

const adjustCityNames = {
    '长沙市': '厂沙市',
    '长春市': '厂春市',
    '长治市': '厂治市',
    '厦门市': '下门市',
    '重庆市': '虫庆市',
};

const _getSectionTitles = (data) => {
    const result = [];
    for (const i in data) {
        const { firstLetter } = data[i];
        result.push(firstLetter);
    }

    return result;
}

export function loadData() {
    return async dispatch => {
        let visitedCities = null;

        try {
            visitedCities = await CityManager.getVisitedCities();
        } catch (e) { }

        const hotCities = CityManager.getHotCities();
        const sectionCityData =
            PinYinUtil.arrayWithFirstLetterFormat(CityManager.getHaveHouseCities(), element => {
                const adjustString = adjustCityNames[element.cityName];
                return adjustString ? adjustString : element.cityName;
            });
        const sectionTitles = _getSectionTitles(sectionCityData);

        dispatch({
            type: Types.CITY_LIST_LOAD_DATA,
            visitedCities,
            hotCities,
            sectionCityData,
            sectionTitles
        });
    }
}

export function startLocation() {
    return dispatch => {
        dispatch({
            type: Types.CITY_LIST_START_LOCATION,
            locationCityName: '定位中...'
        });

        AMapLocation.locationWithCompletion(({ error, city, provice }) => {
            let locationCityName = '无法获取';
            if (!error) {
                locationCityName = city;
                if (!locationCityName.length) locationCityName = provice;
            }

            dispatch({
                type: Types.CITY_LIST_LOCATION_FINISHED,
                locationCityName
            });
        });
    }
}

const defaultState = {
    locationCityName: '',
    visitedCities: [],
    hotCities: [],
    sectionCityData: [],
    sectionTitles: []
};

export function cityListReducer(state = defaultState, action) {
    switch (action.type) {
        case Types.CITY_LIST_LOAD_DATA:
            return {
                ...state,
                visitedCities: action.visitedCities,
                hotCities: action.hotCities,
                sectionCityData: action.sectionCityData,
                sectionTitles: action.sectionTitles,
            }
        case Types.CITY_LIST_START_LOCATION:
        case Types.CITY_LIST_LOCATION_FINISHED:
            return {
                ...state,
                locationCityName: action.locationCityName
            };
        default:
            return state;
    }

}