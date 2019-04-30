import React from 'react';
import { Types } from './base/actions';
// import CityManager from '../sections/city/CityManager';
import Network from '../network';
import { ApiPath } from '../network/ApiService';

export function navBarIsTransparent(contentOffsetY) {
    return dispatch => {
        const isTransparent = contentOffsetY > 100 ? false : true;
        dispatch({
            type: Types.APARTMENT_NAV_BAR_TRANSPARENT,
            isTransparent
        });
    }
}

export function loadData(params, errorCallBack) {
    return dispatch => {
        dispatch({ type: Types.APARTMENT_LOAD_DATA });
        Network
            .my_request({
                apiPath: ApiPath.ESTATE,
                apiMethod: 'estateIntroduction',
                apiVersion: '3.6',
                params
            })
            .then(response => {
                console.log(response);
                dispatch({
                    type: Types.APARTMENT_LOAD_DATA_FINISHED,
                    apartment: response
                });
            })
            .catch(error => {
                if (errorCallBack) errorCallBack(error.message);
                dispatch({ type: Types.APARTMENT_LOAD_DATA_FINISHED });
            });

    }
}

const defaultState = {
    isTransparent: true,
    apartment: {},
};

export function apartmentReducer(state = defaultState, action) {
    switch (action.type) {
        case Types.APARTMENT_LOAD_DATA:
            return {
                ...state,
            }            
        case Types.APARTMENT_LOAD_DATA_FINISHED:
            return {
                ...state,
                apartment: action.apartment,
            }
        case Types.APARTMENT_NAV_BAR_TRANSPARENT:
            return {
                ...state,
                isTransparent: action.isTransparent
            };
        default:
            return state;
    }
}