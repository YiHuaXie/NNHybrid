import { Types } from './base/actions';
import CityManager from '../sections/city/CityManager';
import Network from '../network';
import { ApiPath } from '../network/ApiService';
import AppUtil from '../utils/AppUtil';
import LocationUtil from '../utils/LocationUtil';

export function showCityLocationTip(callBack) {
    return async dispatch => {
        const selectedCity = await CityManager.getSelectedCity();
        const locationCity = await CityManager.getLocationCity();

        if (!AppUtil.isEmptyString(locationCity.cityName) &&
            !AppUtil.isEmptyString(selectedCity.cityName) &&
            locationCity.cityName !== selectedCity.cityName &&
            callBack) {
            callBack(locationCity);
            dispatch({ type: Types.HOME_SHOW_LOCATION_TIP });
        }
    }
}

export function selectedCityFinisedOrChanged(cityName, cityId) {
    return dispatch => {
        CityManager.saveSelectedCity(cityName, cityId);
        CityManager.addVisitedCity({ cityName, cityId });
        dispatch({
            type: Types.HOME_SELECTED_CITY_FINISHED_OR_CHANGED,
            cityName,
            cityId,
        });
    }
}

export function loadSubwayData(cityId) {
    return dispatch => {
        Network.my_request({
            apiPath: ApiPath.COREBASE,
            apiMethod: 'subwayRouteInfoList',
            apiVersion: '1.0',
            params: { cityId }
        }).then(response => {
            console.log(response);
            dispatch({
                type: Types.HOME_LOAD_SUBWAY_DATA_FINISHED,
                subwayData: response.subwayRouteInfo,
            });

            CityManager.saveSubwayData(response.subwayRouteInfo)
        }).catch(error => {
            console.log(error);
            dispatch({
                type: Types.HOME_LOAD_SUBWAY_DATA_FINISHED,
                subwayData: []
            });
        });
    }
}

export function loadData(selectedCity) {
    return dispatch => {
        dispatch({ type: Types.HOME_LOAD_DATA });

        CityManager.loadHaveHouseCityList(async error => {
            if (error) {
                dispatch({
                    type: Types.HOME_LOAD_DATA_FAIL,
                    error: error.message
                });

                return;
            }

            const iconListReq = Network.my_request({
                apiPath: ApiPath.MARKET,
                apiMethod: 'iconList',
                apiVersion: '3.6.4',
                params: { cityId: selectedCity.cityId }
            });

            const houseListReq = Network.my_request({
                apiPath: ApiPath.SEARCH,
                apiMethod: 'recommendList',
                apiVersion: '1.0',
                params: { ...await getRecommendParams(selectedCity), sourceType: 1 }
            });

            Promise
                .all([iconListReq, houseListReq])
                .then(([res1, res2]) => {
                    // console.log(res1);
                    // console.log(res2);
                    dispatch({
                        type: Types.HOME_LOAD_DATA_SUCCESS,
                        banners: res1.focusPictureList,
                        modules: res1.iconList,
                        messages: res1.newsList,
                        vr: res1.marketVR,
                        apartments: res1.estateList,
                        houses: res2.resultList,
                    });
                })
                .catch(error => {
                    dispatch({
                        type: Types.HOME_LOAD_DATA_FAIL,
                        error: error.message
                    });
                });
        });
    }
}

async function getRecommendParams(selectedCity) {
    try {
        const result = await LocationUtil.startLocation();
        const { province, city, longitude, latitude } = result;
        const recommendParams = {};
        const cityName = !AppUtil.isEmptyString(city) ? city : province;
        if (cityName === selectedCity.cityName) {
            recommendParams.gaodeLongitude = longitude;
            recommendParams.gaodeLatitude = latitude;
        } else {
            recommendParams.cityId = selectedCity.cityId;
        }

        return recommendParams;
    } catch (e) { return {}; }
}

const defaultState = {
    banners: [],
    modules: [],
    messages: [],
    vr: null,
    apartments: [],
    subwayData: [],
    houses: [],
    cityName: '',
    cityId: '',
    isLoading: true,
    error: null
};

export function homeReducer(state = defaultState, action) {
    switch (action.type) {
        case Types.HOME_SELECTED_CITY_FINISHED_OR_CHANGED:
            return {
                ...state,
                cityName: action.cityName,
                cityId: action.cityId,
            };
        case Types.HOME_LOAD_DATA:
            return {
                ...state,
                isLoading: true,
            }
        case Types.HOME_LOAD_DATA_SUCCESS:
            return {
                ...state,
                banners: action.banners,
                modules: action.modules,
                messages: action.message,
                vr: action.vr,
                apartments: action.apartments,
                houses: action.houses,
                isLoading: false,
                error: null
            }
        case Types.HOME_LOAD_SUBWAY_DATA_FINISHED:
            return {
                ...state,
                subwayData: action.subwayData
            }
        case Types.HOME_LOAD_DATA_FAIL:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        default:
            return state;
    }
}