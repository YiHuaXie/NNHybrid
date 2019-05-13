import { ApiPath } from '../network/ApiService';
import Network from '../network';
import { Types } from './base/actions';
import AppUtil from '../utils/AppUtil';

export const DetailTypes = {
    Centralied: 'Centralied',
    Decentralied: 'Decentralied'
};

export const getStoreName = (detailType, id) => {
    return detailType + id;
}

export function init(storeName) {
    return dispatch => {
        dispatch({ type: Types.HOUSE_DETAIL_INIT, storeName });
    }
}

export function navBarIsTransparent(contentOffsetY, storeName) {
    return dispatch => {
        const isTransparent = contentOffsetY > 100 ? false : true;
        dispatch({ type: Types.HOUSE_DETAIL_NAV_BAR_TRANSPARENT, isTransparent, storeName });
    }
}

export function loadData(detailType, params, storeName, callBack) {
    return async dispath => {
        dispath({ type: Types.HOUSE_DETAIL_LOAD_DATA, storeName });
        try {
            let response =
                detailType === DetailTypes.Centralied ?
                    await loadCentraliedDetail(params) :
                    await loadDecentraliedDetail(params);

            let recommendParams = {
                gaodeLongitude: response.longitude,
                gaodeLatitude: response.latitude,
                sourceType: 2,
                rentPrice: DetailTypes.Centralied ? response.rentPrice : response.price,
                currentHousingType: DetailTypes.Centralied ? 1 : 2,
                roomId: DetailTypes.Centralied ? null : response.roomId,
                estateRoomTypeId: DetailTypes.Centralied ? response.estateRoomTypeId : null
            };
            let response2 = await loadRecommendHouseList(recommendParams);

            dispath({
                type: Types.HOUSE_DETAIL_LOAD_DATA_FINISHED,
                storeName,
                centraliedHouse: detailType === DetailTypes.Centralied ? response : {},
                decentraliedHouse: detailType === DetailTypes.Centralied ? {} : response,
                recommendHouseList: response2.resultList
            });
        } catch (e) {
            callBack(e.message);
            dispath({ type: Types.HOUSE_DETAIL_LOAD_DATA_FINISHED, storeName });
        }
    };
}

/**
 * 分散式房源详情
 * @param {{}}} params 
 */
function loadDecentraliedDetail(params) {
    return Network.my_request({
        apiPath: ApiPath.HOUSE,
        apiMethod: 'queryHouseRoomDetail',
        apiVersion: '3.6',
        params
    });
}

/**
 * 集中式房源详情
 * @param {{}}} params 
 */
function loadCentraliedDetail(params) {
    return Network.my_request({
        apiPath: ApiPath.ESTATE,
        apiMethod: 'eRoomTypeDetail',
        apiVersion: '3.9.0',
        params
    });
}

/**
 * 房源推荐列表
 * @param {{}} params 
 */
function loadRecommendHouseList(params) {
    return Network.my_request({
        apiPath: ApiPath.SEARCH,
        apiMethod: 'recommendList',
        apiVersion: '1.0',
        params
    });
}

const defaultHouseDetail = {
    centraliedHouse: {},
    decentraliedHouse: {},
    isTransparent: true,
    recommendHouseList: [],
    isLoading: false
}

const defaultState = {};

export function houseDetailReducer(state = defaultState, action) {
    switch (action.type) {
        case Types.HOUSE_DETAIL_INIT:
        return {
            ... state,
            [action.storeName]: {
                ...defaultHouseDetail,
            }
        }
        case Types.HOUSE_DETAIL_LOAD_DATA:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                }
            }
        case Types.HOUSE_DETAIL_LOAD_DATA_FINISHED:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    centraliedHouse: action.centraliedHouse,
                    decentraliedHouse: action.decentraliedHouse,
                    recommendHouseList: action.recommendHouseList,
                    isLoading: false,
                }
            }
        case Types.HOUSE_DETAIL_NAV_BAR_TRANSPARENT:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isTransparent: action.isTransparent
                }
            }
        default:
            return state;
    }
}