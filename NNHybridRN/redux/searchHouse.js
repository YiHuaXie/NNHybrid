import { Types } from './base/actions';
import Network from '../network';
import { ApiPath } from '../network/ApiService';
import { RefreshState } from '../components/common/NNRefreshFlatList';
import AppUtil from '../utils/AppUtil';

export function loadData(params, currentPage, errorCallBack) {
    return dispatch => {
        dispatch({ type: currentPage == 1 ? Types.SEARCH_HOUSE_LOAD_DATA : Types.SEARCH_HOUSE_LOAD_MORE_DATA });
        console.log(currentPage);

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
                console.log(response);
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
    refreshState: RefreshState.Idle,
    currentPage: 1,
    // hasMoreData: false,
}

export function searchHouseReducer(state = defaultState, action) {
    switch (action.type) {
        case Types.SEARCH_HOUSE_LOAD_DATA: {
            return {
                ...state,
                refreshState: RefreshState.HeaderRefreshing,
            }
        }
        case Types.SEARCH_HOUSE_LOAD_MORE_DATA: {
            return {
                ...state,
                refreshState: RefreshState.FooterRefreshing,
            }
        }
        case Types.SEARCH_HOUSE_LOAD_DATA_FAIL: {
            return {
                ...state,
                refreshState: RefreshState.Failure,
            }
        }
        case Types.SEARCH_HOUSE_LOAD_DATA_SUCCESS: {
            const houseList = action.currentPage <= 2 ? action.houseList : state.houseList.concat(action.houseList);
            let refreshState = RefreshState.Idle;
            if (AppUtil.isEmptyArray(houseList)) {
                refreshState = RefreshState.EmptyData;
            } else if (!action.hasMoreData) {
                refreshState = RefreshState.NoMoreData;
            }

            return {
                ...state,
                houseList: action.currentPage <= 2 ? action.houseList : state.houseList.concat(action.houseList),
                // totalPages: action.totalPages,
                currentPage: action.currentPage,
                // hasMoreData: action.hasMoreData,
                refreshState,
                // hideLoadingMore: !action.hasMoreData
                // isLoadingMore: false,
            }
        }
        default:
            return state;
    }
}