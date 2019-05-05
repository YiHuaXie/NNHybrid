import { NativeModules } from 'react-native';
import { Types } from './base/actions';
import CityManager from '../sections/city/CityManager';
import Network from '../network';
import { ApiPath } from '../network/ApiService';
import AppUtil from '../utils/AppUtil';

const AMapLocation = NativeModules.AMapLocationModule;

// export function showCityLocationTip(callBack) {
//     return async dispatch => {

//         AMapLocation.locationWithCompletion(({ error, city, provice }) => {
//             if (!error) {

//                 const selectedCity = await CityManager.getSelectedCity();
//                 const locationCity = await CityManager.getLocationCity();

//                 if (!AppUtil.isEmptyString(locationCity.cityName) &&
//                     !AppUtil.isEmptyString(selectedCity.cityName) &&
//                     callBack) {
//                     callBack(locationCity.cityName);
//                 }
//             }

//             dispatch({ type: Types.HOME_LOCATION });
//         });
//     }
// }

export function navBarIsTransparent(contentOffsetY) {
    return dispatch => {
        const isTransparent = contentOffsetY > 100 ? false : true;
        dispatch({
            type: Types.HOME_NAV_BAR_TRANSPARENT,
            isTransparent
        });
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

export function loadData(cityId) {
    return dispatch => {
        dispatch({ type: Types.HOME_LOAD_DATA });
        CityManager.loadHaveHouseCityList(error => {
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
                params: { cityId }
            });

            let houseListReq = null;
            const selectedCity = CityManager.getSelectedCity();
            const locationCity = CityManager.getLocationCity();
            const isSame = selectedCity.cityName === locationCity.cityName;
            const tmpCityId = isSame ? null : selectedCity.cityId;

            AMapLocation.locationWithCompletion(({ error, longitude, latitude }) => {
                if (!error) {
                    const params = {
                        cityId: tmpCityId,
                        sourceType: 1,
                        gaodeLongitude: longitude,
                        gaodeLatitude: latitude
                    };

                    houseListReq = Network.my_request({
                        apiPath: ApiPath.SEARCH,
                        apiMethod: 'recommendList',
                        apiVersion: '1.0',
                        params,
                    });
                }
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

const defaultState = {
    banners: [],
    modules: [],
    messages: [],
    vr: null,
    apartments: [],
    houses: [],
    isTransparent: true,
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
        case Types.HOME_LOAD_DATA_FAIL:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case Types.HOME_NAV_BAR_TRANSPARENT:
            return {
                ...state,
                isTransparent: action.isTransparent
            };
        default:
            return state;
    }
}