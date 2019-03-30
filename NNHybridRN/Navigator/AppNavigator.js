import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { connect } from 'react-redux';
import { createReactNavigationReduxMiddleware, createReduxContainer } from 'react-navigation-redux-helpers';

import StartContainer from '../containers/StartContainer';
import LoginContainer from '../containers/LoginContainer';

export const rootCom = 'Start';

const StartNavigator = createStackNavigator({
    StartContainer: {
        screen: StartContainer,
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