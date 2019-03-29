import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { connect } from 'react-redux';
import { createReactNavigationReduxMiddleware, createReduxContainer } from 'react-navigation-redux-helpers';

// import MomentsPage from '../Section/Moments/MomentsPage';
import LoginPage from '../sections/login/LoginPage';

export const rootCom = 'Login';

// const MainNavigator = createStackNavigator({
//     MomentsPage: {
//         screen: MomentsPage,
//         navigationOptions: { header: null }
//     }
// });

const LoginNavigator = createStackNavigator({
    LoginPage: {
        screen: LoginPage,
        navigationOptions: { header: null }
    }
});

export const RootNavigator = createAppContainer(createSwitchNavigator(
    {
        Login: LoginNavigator,
        // Main: MainNavigator
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