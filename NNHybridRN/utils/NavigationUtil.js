import { NavigationActions } from 'react-navigation';
import NativeUtil from './NativeUtil';
import AppUtil from './AppUtil';

const NativePageNames = ['AddressOnMapPage'];
const NativePageIsModal = [];
const NativePageMap = {
    AddressOnMapPage: AppUtil.iOS ? 'AddressOnMapViewController' : '',
}

export default class NavigationUtil {

    static goPage(page, parameters) {
        const navigation = NavigationUtil.navigation;
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null');
            return;
        }

        if (NativePageNames.some(name => name === page)) {
            const isModal = NativePageIsModal.some(name => name === page);
            NativeUtil.jumpTo(NativePageMap[page], parameters, isModal);
        } else {
            navigation.navigate(page, { ...parameters });
        }
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