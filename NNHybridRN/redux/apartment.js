import { Types } from './base/actions';
import Network from '../network';
import { ApiPath } from '../network/ApiService';

export const getStoreName = id => {
    return new Date().getTime();
}

export function init(storeName) {
    return dispatch => {
        dispatch({ type: Types.APARTMENT_INIT, storeName });
    }
}

export function navBarIsTransparent(storeName, contentOffsetY) {
    return dispatch => {
        const isTransparent = contentOffsetY > 100 ? false : true;
        dispatch({
            type: Types.APARTMENT_NAV_BAR_TRANSPARENT,
            isTransparent,
            storeName
        });
    }
}

export function loadData(storeName, params, errorCallBack) {
    return dispatch => {
        dispatch({ type: Types.APARTMENT_LOAD_DATA, storeName });
        Network
            .my_request({
                apiPath: ApiPath.ESTATE,
                apiMethod: 'estateIntroduction',
                apiVersion: '3.6',
                params
            })
            .then(response => {

                dispatch({
                    type: Types.APARTMENT_LOAD_DATA_FINISHED,
                    apartment: response,
                    storeName,
                });
            })
            .catch(error => {
                if (errorCallBack) errorCallBack(error.message);
                dispatch({ type: Types.APARTMENT_LOAD_DATA_FINISHED, storeName });
            });

    }
}

const defaultApartment = {
    isTransparent: true,
    apartment: {},
    isLoading: false
}

const defaultState = {};

export function apartmentReducer(state = defaultState, action) {
    switch (action.type) {
        case Types.APARTMENT_INIT: {
            return {
                ...state,
                [action.storeName]: {
                    ...defaultApartment,
                }
            }
        }
        case Types.APARTMENT_LOAD_DATA:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                }
            }
        case Types.APARTMENT_LOAD_DATA_FINISHED:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    apartment: action.apartment,
                    isLoading: false,
                }
            }
        case Types.APARTMENT_NAV_BAR_TRANSPARENT:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isTransparent: action.isTransparent
                }
            };
        default:
            return state;
    }
}