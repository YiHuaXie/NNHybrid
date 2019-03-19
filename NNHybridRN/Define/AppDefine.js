import { DeviceInfo, Platform, Dimensions } from 'react-native';

const window = Dimensions.get('window');

export default {
    app_theme: '#FF8c07',
    app_background: '#FFFFFF',
    app_black: '#030303',
    app_clear: 'transparent',

    navigation_bar_height: Platform.OS === 'ios' ? 44 : 50,
    full_navigation_bar_height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 88 : 64) : 50,
    status_bar_height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 44 : 20) : 0,
    tab_bar_height: DeviceInfo.isIPhoneX_deprecated ? 83 : 49,
    window_width: window.width,
    window_height: window.height,

    navigation_title_font: 17,
}


