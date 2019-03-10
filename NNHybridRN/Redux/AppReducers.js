import { combineReducers } from 'redux';
import { rootCom, RootNavigator } from '../Navigator/AppNavigator';

/**
 * 1.create default navigation state
 */
const defaultNavState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

/**
 * 2.create navigation reducer，
 */
const navReducer = (state = defaultNavState, action) => {
    const nextState = RootNavigator.router.getStateForAction(action, state);
    return nextState || state;
};

/**
 * 3.combine all reducers in project
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
export default combineReducers({
    nav: navReducer
});