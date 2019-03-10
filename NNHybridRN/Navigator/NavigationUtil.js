export default class NavigationUtil {

    static goPage(parameters, page) {
        const navigation = NavigationUtil.navigation;
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null');
            return;
        }

        navigation.navigate(page, { ...parameters });
    }

    static goBack(navigation) {
        navigation.goBack();
    }
}