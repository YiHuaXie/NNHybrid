import { NativeModules } from 'react-native';


const UserDefault = NativeModules.UserDefaultModule;
const Share = NativeModules.ShareModule;
const NativeJump = NativeModules.NativeJumpModule;

export default class NativeUtil {

    static jumpTo(vcName, params, isModal) {
        NativeJump.jumpToNativePage(vcName, params, isModal);
    }

    /**
     * 分享
     * @param {{ title, description, image, webUrl, message }} parameters 分享参数
     */
    static share(parameters) {
        Share.shareWithParameters(parameters);
    }

    static objectForKey(key) {
        return new Promise((resolve, reject) => {
            UserDefault.objectForKey(key, data => {
                resolve(data);
            });
        });
    }
}