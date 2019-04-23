import React from 'react';
import { Types } from './base/actions';
import CityManager from '../sections/city/CityManager';
import Network from '../network';
import { ApiPath } from '../network/ApiService';

export function navBarIsTransparent(contentOffsetY) {
    return dispatch => {
        const isTransparent = contentOffsetY > 100 ? false : true;
        dispatch({
            type: Types.HOME_NAV_BAR_TRANSPARENT,
            isTransparent
        });
    }
}

// export function cityLocation(callBack) {
//     return dispatch => {
//         CityManager.cityLocation((cityName, cityId) => {
//             selectedCityFinisedOrChanged(cityName, cityId, () => {
//                 callBack(cityName, cityId);
//             })
//             CityManager.saveSelectedCity(cityName, cityId);
//             CityManager.addVisitedCity({ cityName, cityId });
//             dispatch({
//                 type: Types.HOME_CITY_LOCATION,
//                 cityName,
//                 cityId,
//             });
//             callBack(cityName, cityId);
//         });
//     }
// }

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
            const houseListReq = Network.my_request({
                apiPath: ApiPath.SEARCH,
                apiMethod: 'recommendList',
                apiVersion: '1.0',
                params: { cityId, sourceType: 1 }
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