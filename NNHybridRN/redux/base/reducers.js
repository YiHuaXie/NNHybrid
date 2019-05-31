import { combineReducers } from 'redux';
import { navReducer } from '../../navigator/AppNavigator';
import { cityListReducer } from '../cityList';
import { homeReducer } from '../home';
import { houseDetailReducer } from '../houseDetail';
import { apartmentReducer } from '../apartment';
import { searchHouseReducer } from '../searchHouse';
import { Types } from './actions';

// import { rootCom, RootNavigator } from '../../navigator/AppNavigator';
// import { createNavigationReducer } from 'react-navigation-redux-helpers';

// 以下就是createNavigationReducer的实现
// const defaultNavState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

// const navReducer = (state = defaultNavState, action) => {
//     const nextState = RootNavigator.router.getStateForAction(action, state);
//     return nextState || state;
// };

// const navReducer = createNavigationReducer(RootNavigator);

const appReducers = combineReducers({
    nav: navReducer,
    home: homeReducer,
    cityList: cityListReducer,
    apartments: apartmentReducer,
    houseDetails: houseDetailReducer,
    searchHouse: searchHouseReducer,
});

// How to reset the state of a Redux store
// https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
export default (state, action) => {
    switch (action.type) {
        case Types.APARTMENT_WILL_UNMOUNT:
            delete state.apartments[action.storeName];
            break;
        case Types.HOUSE_DETAIL_WILL_UNMOUNT:
            delete state.houseDetails[action.storeName];
            break;
        case Types.SEARCH_HOUSE_WILL_UNMOUNT:
                delete state.searchHouse;
            break;
    }

    return appReducers(state, action);
}
