import { ApiPath } from '../network/ApiService';
import Network from '../network';
import { Types } from './base/actions';

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
                type: Types.HOUSE_DETAIL_LOAD_CENTRALIZED,
                centraliedHouse: response
            });

        } catch (e) {
            callBack(e.message);
        }
    };
}

/**
 * 分散式房源详情
 * @param {function} callBack 
 */
function loadDecentraliedDetail(callBack) {

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

function loadActivityGIF() {

}

const defaultState = {
    centraliedHouse: {}
};

export function houseDetailReducer(state = defaultState, action) {
    switch (action.type) {
        case Types.HOUSE_DETAIL_LOAD_CENTRALIZED:
            return {
                ...state,
                centraliedHouse: action.centraliedHouse
            };
        default:
            return state;
    }
}