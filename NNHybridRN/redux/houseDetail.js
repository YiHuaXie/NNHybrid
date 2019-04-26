import { ApiPath } from '../network/ApiService';
import Network from '../network';
import { Types } from './base/actions';

export function pageWillUnmount() {
    return dispatch => {
        dispatch({ type: Types.HOUSE_DETAIL_WILL_UNMOUNT });
    }
}

export function navBarIsTransparent(contentOffsetY) {
    return dispatch => {
        const isTransparent = contentOffsetY > 100 ? false : true;
        dispatch({ type: Types.HOUSE_DETAIL_NAV_BAR_TRANSPARENT, isTransparent });
    }
}

/**
 * 集中式房源详情
 * @param {*} callBack 
 */
export function loadCentraliedDetail(params, callBack) {
    return async dispath => {
        try {
            let response = await Network.my_request({
                apiPath: ApiPath.ESTATE,
                apiMethod: 'eRoomTypeDetail',
                apiVersion: '3.9.0',
                params
            });

            dispath({
                type: Types.HOUSE_DETAIL_LOAD_CENTRALIZED_SUCCESS,
                centraliedHouse: response
            });

        } catch (e) {
            callBack(e.message);
            dispath({ type: Types.HOUSE_DETAIL_LOAD_DATA_FAIL });
        }
    };
}

/**
 * 分散式房源详情
 * @param {function} callBack 
 */
export function loadDecentraliedDetail(houseId, callBack) {
    return async dispath => {
        try {
            let response = await Network.my_request({
                apiPath: ApiPath.HOUSE,
                apiMethod: 'queryHouseRoomDetail',
                apiVersion: '3.6',
                params: { roomId: houseId }
            });

            let response2 = await loadRecommendHouseList({

            });

            dispath({
                type: Types.HOUSE_DETAIL_LOAD_DECENTRALIZED_SUCCESS,
                decentraliedHouse: response

            });
        } catch (e) {
            callBack(e.message);
            dispath({ type: Types.HOUSE_DETAIL_LOAD_DATA_FAIL });
        }
    };
}

function loadRecommendHouseList(params) {
    return Network
        .request({
            apiPath: ApiPath.SEARCH,
            apiMethod: 'recommendList',
            apiVersion: '1.0',
            params
        });
}

const defaultState = {
    centraliedHouse: {},
    decentraliedHouse: {},
    isTransparent: true,
    recommendHouseList: [],
};

export function houseDetailReducer(state = defaultState, action) {
    switch (action.type) {
        case Types.HOUSE_DETAIL_LOAD_CENTRALIZED_SUCCESS:
            return {
                ...state,
                centraliedHouse: action.centraliedHouse,
                recommendHouseList: action.recommendHouseList
            };
        case Types.HOUSE_DETAIL_LOAD_DECENTRALIZED_SUCCESS:
            return {
                ...state,
                decentraliedHouse: action.decentraliedHouse,
                recommendHouseList: action.recommendHouseList
            };
        case Types.HOUSE_DETAIL_NAV_BAR_TRANSPARENT:
            return {
                ...state,
                isTransparent: action.isTransparent
            }
        case Types.HOUSE_DETAIL_WILL_UNMOUNT:
            return defaultState
        default:
            return state;
    }
}