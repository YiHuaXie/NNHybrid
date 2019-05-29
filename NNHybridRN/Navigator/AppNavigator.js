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
import CityListPage from '../sections/city/CityListPage';
import ApartmentPage from '../sections/apartment/ApartmentPage';
import DecentraliedDetailPage from '../sections/houseDetail/DecentraliedDetailPage';
import CentraliedDetailPage from '../sections/houseDetail/CentraliedDetailPage';
import SearchHousePage from '../sections/searchHouse/SearchHousePage';
import TestRefreshPage from '../sections/searchHouse/TestRefreshPage';

// dynamic modal transition
const IOS_MODAL_ROUTES = ['CityListPage'];

const dynamicModalTransition = (transitionProps, prevTransitionProps) => {
    const isModal = IOS_MODAL_ROUTES.some(
        screenName =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
    )

    return StackViewTransitionConfigs.defaultTransitionConfig(
        transitionProps,
        prevTransitionProps,
        isModal
    );
};

const sharedParams = { navigationOptions: { header: null } };

const StartNavigator = createStackNavigator({
    StartContainer: {
        ...sharedParams,
        screen: StartContainer,
    }
});

const MainNavigator = createStackNavigator({
    MainContainer: {
        ...sharedParams,
        screen: MainContainer,
    },
    CityListPage: {
        screen: CityListPage,
        ...sharedParams,
        navigationOptions: { header: null }
    },
    ApartmentPage: {
        ...sharedParams,
        screen: ApartmentPage,
    },
    DecentraliedDetailPage: {
        ...sharedParams,
        screen: DecentraliedDetailPage,
    },
    CentraliedDetailPage: {
        ...sharedParams,
        screen: CentraliedDetailPage,
    },
    SearchHousePage: {
        ...sharedParams,
        screen: SearchHousePage,
    },
    TestRefreshPage: {
        ...sharedParams,
        screen: TestRefreshPage,
    }
}, {
        transitionConfig: dynamicModalTransition
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
        initialRouteName: 'Main'
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