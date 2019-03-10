import { DeviceInfo, Platform, Dimensions } from 'react-native';

const window = Dimensions.get('window');

export default {
    app_theme: '#FF8c07',
    app_background: '#FFFFFF',
    app_black: '#030303',

    navigation_bar_height: heightForNavigationBar(),
    full_navigation_bar_height: heightForNavigationBar() + heightForStatusBar(),
    status_bar_height: heightForStatusBar(),
    window_width: window.width,
    window_height: window.height,
}

function heightForNavigationBar() {
    return Platform.OS === 'ios' ? 44 : 50;
}

function heightForStatusBar() {
    return Platform.OS === 'ios' ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0
}


