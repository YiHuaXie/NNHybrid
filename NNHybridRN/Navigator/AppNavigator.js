import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { connect } from 'react-redux';
import { createReactNavigationReduxMiddleware, createReduxContainer } from 'react-navigation-redux-helpers';

import StartContainer from '../containers/StartContainer';
import MainContainer from '../containers/MainContainer';
import LoginContainer from '../containers/LoginContainer';

export const rootCom = 'Main';

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
    }
});

const LoginNavigator = createStackNavigator({
    LoginContainer: {
        screen: LoginContainer,
        navigationOptions: { header: null }
    }
});

export const RootNavigator = createAppContainer(createSwitchNavigator(
    {
        Start: StartNavigator,
        Main: MainNavigator,
        Login: LoginNavigator,
    }, {
        navigationOptions: {
            header: null,
        }
    }
));

export const navMiddleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    'root'
);

const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

const mapStateToProps = state => ({
    state: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);