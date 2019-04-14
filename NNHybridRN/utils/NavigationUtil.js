import { NavigationActions } from 'react-navigation';

export default class NavigationUtil {

    static goPage(page, parameters) {
        const navigation = NavigationUtil.navigation;
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null');
            return;
        }

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
}