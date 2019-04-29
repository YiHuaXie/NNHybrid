import { NavigationActions } from 'react-navigation';

export default class NavigationUtil {

    static goPage(page, parameters) {
        const navigation = NavigationUtil.navigation;
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null');
            return;
        }

        console.log(NavigationUtil.navigation);
        navigation.navigate(page, { ...parameters });
    }

    static goBack() {
        const { dispatch } = NavigationUtil.navigation;
        dispatch(NavigationActions.back());
    }

    static jumpToMain() {
        const { dispatch } = NavigationUtil.navigation;
        dispatch(NavigationActions.navigate({ routeName: 'Main' }));
    }

    static jumpToLogin() {
        const { dispatch } = NavigationUtil.navigation;
        dispatch(NavigationActions.navigate({ routeName: 'Login' }));
    }

    static dispatch(actionType) {
        const navigation = NavigationUtil.navigation;
        navigation.dispatch({ type: actionType });
    }
}