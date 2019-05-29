import { Types } from './base/actions';
import Network from '../network';
import { ApiPath } from '../network/ApiService';
import { HeaderRefreshState, FooterRefreshState } from '../components/refresh/RefreshConst';
import AppUtil from '../utils/AppUtil';

export function loadData(params, currentPage, errorCallBack) {
    return dispatch => {
        dispatch({ type: currentPage == 1 ? Types.SEARCH_HOUSE_LOAD_DATA2 : Types.SEARCH_HOUSE_LOAD_MORE_DATA2 });
        // console.log(currentPage);

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
                const tmpResponse = AppUtil.makeSureObject(response);
                const hasMoreData = currentPage < tmpResponse.totalPages;
                const houseList = AppUtil.makeSureArray(tmpResponse.resultList);
                dispatch({
                    type: Types.SEARCH_HOUSE_LOAD_DATA_SUCCESS2,
                    currentPage: ++currentPage,
                    houseList,
                    hasMoreData,
                });
            })
            .catch(error => {
                if (errorCallBack) errorCallBack(error.message);

                const action = { type: Types.SEARCH_HOUSE_LOAD_DATA_FAIL2 };
                if (currentPage == 1) {
                    action.houseList = []
                    action.currentPage = 1;
                };

                dispatch(action);
            });
    }
}

const defaultState = {
    houseList: [],
    headerRefreshState: HeaderRefreshState.Idle,
    footerRefreshState: FooterRefreshState.Idle,
    currentPage: 1,
}

export function searchHouseReducer2(state = defaultState, action) {
    switch (action.type) {
        case Types.SEARCH_HOUSE_LOAD_DATA2: {
            return {
                ...state,
                headerRefreshState: HeaderRefreshState.Refreshing
            }
        }
        case Types.SEARCH_HOUSE_LOAD_MORE_DATA2: {
            return {
                ...state,
                footerRefreshState: FooterRefreshState.Refreshing,
            }
        }
        case Types.SEARCH_HOUSE_LOAD_DATA_FAIL2: {
            return {
                ...state,
                headerRefreshState: HeaderRefreshState.Idle,
                footerRefreshState: FooterRefreshState.Failure,
                houseList: action.houseList ? action.houseList : state.houseList,
                currentPage: action.currentPage,
            }
        }
        case Types.SEARCH_HOUSE_LOAD_DATA_SUCCESS2: {
            const houseList = action.currentPage <= 2 ? action.houseList : state.houseList.concat(action.houseList);

            let footerRefreshState = FooterRefreshState.Idle;
            if (AppUtil.isEmptyArray(houseList)) {
                footerRefreshState = FooterRefreshState.EmptyData;
            } else if (!action.hasMoreData) {
                footerRefreshState = FooterRefreshState.NoMoreData;
            }

            return {
                ...state,
                houseList: action.currentPage <= 2 ? action.houseList : state.houseList.concat(action.houseList),
                currentPage: action.currentPage,
                headerRefreshState: HeaderRefreshState.Idle,
                footerRefreshState,
            }
        }
        default:
            return state;
    }
}