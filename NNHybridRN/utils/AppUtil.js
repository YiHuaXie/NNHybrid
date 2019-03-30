import { DeviceInfo, Platform, Dimensions } from 'react-native';

const window = Dimensions.get('window');

export default {
    app_theme: '#FF8c07',
    app_background: '#FFFFFF',
    app_black: '#030303',
    app_clear: 'transparent',
    app_lightGray: '#DDDDDD',

    navigationBarHeight: Platform.OS === 'ios' ? 44 : 50,
    fullNavigationBarHeight: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 88 : 64) : 50,
    statusBarHeight: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 44 : 20) : 0,
    tabBarHeight: DeviceInfo.isIPhoneX_deprecated ? 83 : 49,
    windowWidth: window.width,
    windowHeight: window.height,

    navigationTitleFont: 17,
}


