import { NavigationActions } from 'react-navigation';
import NativeUtil from './NativeUtil';
import AppUtil from './AppUtil';
import { FilterMenuType } from '../sections/searchHouse/SearchFilterMenu';
import Toaster from '../components/common/Toaster';

const NativePageNames = ['AddressOnMapPage'];
const NativePageIsModal = [];
const NativePageMap = {
    AddressOnMapPage: AppUtil.iOS ? 'AddressOnMapViewController' : '',
}

const PageForCodeMap = {
    '6001': { page: 'SearchHousePage', params: { filterMenuType: FilterMenuType.PAYMONTHLY } },
    '6002': { page: 'SearchHousePage', params: { filterMenuType: FilterMenuType.BELOWTHOUSAND } },
    '6005': { page: 'SearchHousePage', params: { filterMenuType: FilterMenuType.APARTMENT } },
    '6006': { page: 'SearchHousePage', params: { filterMenuType: FilterMenuType.ENTIRERENT } },
    '6007': { page: 'SearchHousePage', params: { filterMenuType: FilterMenuType.SHAREDRENT } },
};

export default class NavigationUtil {

    static goPageWithCode(code, parameters) {
        const pageNode = PageForCodeMap[`${code}`];
        if (AppUtil.isEmptyObject(pageNode)) {
            Toaster.autoDisapperShow('暂不支持该功能');
            return;
        }

        this.goPage(pageNode.page, { ...parameters, ...pageNode.params });
    }

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
            navigation.push(page, { ...parameters });
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

    static dispatch(actionType, storeName) {
        const navigation = NavigationUtil.navigation;
        navigation.dispatch({ type: actionType, storeName });
    }
}