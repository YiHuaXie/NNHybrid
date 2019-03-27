import { ActionTypes } from './HomeAction';

const defaultState = {

};

/**
 * 设置首页的State树
 * home: {
 *  banner:{
 * 
 *  },
 *  module: {
 *  },
 *  message: {
 *  },
 * 
 * }
 * @param {*} state 
 * @param {*} action 
 */
// export default function onAction(state = defaultState, action) {
//     switch (action.type) {
//         case ActionTypes.HOME_REFRESH:
//             return {
//                 ...state,
//                 [action.storeName]: {
//                     ...state[action.storeName],
//                 }

//             }
//     }
// }