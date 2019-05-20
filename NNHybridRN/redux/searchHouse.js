import { Types } from './base/actions';
import Network from '../network';
import { ApiPath } from '../network/ApiService';

export function loadData(params, currentPage = 1, errorCallBack) {
    return dispatch => {
        dispatch({ type: currentPage == 1 ? Types.SEARCH_HOUSE_LOAD_DATA : Types.SEARCH_HOUSE_LOAD_MORE_DATA });
        Network
            .my_request({
                apiPath: ApiPath.SEARCH,
                apiMethod: 'searchByPage',
                apiVersion: '1.0',
                params: {
                    ...params,
                    pageNo: currentPage,
                    pageSize: 10
                }
            })
            .then(response => {
                const hasMoreData = currentPage < response.totalPages;
                dispatch({
                    type: Types.SEARCH_HOUSE_LOAD_DATA_SUCCESS,
                    currentPage: ++currentPage,
                    houseList: response.resultList,
                    hasMoreData,
                });
            })
            .catch(error => {
                if (errorCallBack) errorCallBack(error.message);
                dispatch({ type: Types.SEARCH_HOUSE_LOAD_DATA_FAIL });
            });
    }
}

const defaultState = {
    houseList: [],
    isRefreshing: false,
    // isLoadingMore: false,
    hideLoadingMore: false,
    currentPage: 1,
    hasMoreData: false,
}

export function searchHouseReducer(state = defaultState, action) {
    switch (action.type) {
        case Types.SEARCH_HOUSE_LOAD_DATA: {
            return {
                ...state,
                isRefreshing: true,
                hideLoadingMore: true,
            }
        }
        case Types.SEARCH_HOUSE_LOAD_MORE_DATA: {
            return {
                ...state,
                isRefreshing: false,
                hideLoadingMore: false
            }
        }
        case Types.SEARCH_HOUSE_LOAD_DATA_FAIL: {
            return {
                ...state,
                isRefreshing: false,
                // isLoadingMore: false,
                hideLoadingMore: true,
            }
        }
        case Types.SEARCH_HOUSE_LOAD_DATA_SUCCESS:
            return {
                ...state,
                houseList: action.currentPage <= 2 ? action.houseList : state.houseList.concat(action.houseList),
                totalPages: action.totalPages,
                currentPage: action.currentPage,
                hasMoreData: action.hasMoreData,
                isRefreshing: false,
                hideLoadingMore: true,
                // hideLoadingMore: !action.hasMoreData
                // isLoadingMore: false,
            }
        default:
            return state;
    }
}