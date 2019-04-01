import {
    createStackNavigator,
    createSwitchNavigator,
    createAppContainer,
    StackViewTransitionConfigs
} from 'react-navigation';
import { connect } from 'react-redux';
import {
    createReactNavigationReduxMiddleware,
    createReduxContainer,
    createNavigationReducer
} from 'react-navigation-redux-helpers';

import StartContainer from '../containers/StartContainer';
import MainContainer from '../containers/MainContainer';
import LoginContainer from '../containers/LoginContainer';
import HouseDetailPage from '../sections/houseDetail/HouseDetailPage';
import CityListPage from '../sections/city/CityListPage';

// dynamic modal transition
// const IOS_MODAL_ROUTES = ['LoginPage'];

// const dynamicModalTransition = (transitionProps, prevTransitionProps) => {
//     const isModal = IOS_MODAL_ROUTES.some(
//         screenName =>
//             screenName === transitionProps.scene.route.routeName ||
//             (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
//     )

//     return StackViewTransitionConfigs.defaultTransitionConfig(
//         transitionProps,
//         prevTransitionProps,
//         isModal
//     );
// };

const StartNavigator = createStackNavigator({
    StartContainer: {
        screen: StartContainer,
        navigationOptions: { header: null }
    }
});

const MainNavigator = createStackNavigator({
    MainContainer: {
        screen: MainContainer,
        navigationOptions: { header: null }
    },
    HouseDetailPage: {
        screen: HouseDetailPage,
    },
    CityListPage: {
        screen: CityListPage,
    }
});

const LoginNavigator = createStackNavigator({
    LoginContainer: {
        screen: LoginContainer,
        navigationOptions: { header: null },
    }
});

const RootNavigator = createAppContainer(createSwitchNavigator(
    {
        Start: StartNavigator,
        Main: MainNavigator,
        Login: LoginNavigator,
    }, {
        navigationOptions: { header: null },
    }
));

// system navigation reducer
export const navReducer = createNavigationReducer(RootNavigator);

// custom navigation reducer
// const initialAction = RootNavigator.router.getActionForPathAndParams('Main');
// const initialState = RootNavigator.router.getStateForAction(initialAction);

// export const navReducer = (state = initialState, action) => {
//     const nextState = RootNavigator.router.getStateForAction(action, state);
//     return nextState || state;
// };

// Note: createReactNavigationReduxMiddleware must be run before createReduxContainer
export const navMiddleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    'root'//这个key作用未知
);

const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

const mapStateToProps = state => ({
    state: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);