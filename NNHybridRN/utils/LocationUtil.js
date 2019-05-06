import { NativeModules } from 'react-native';
const AMapLocation = NativeModules.AMapLocationModule;

export default class LocationUtil {

    static locationWithCompletion(callBack) {
        AMapLocation.locationWithCompletion(result => callBack(result));
    }

    static startLocation() {
        return new Promise((resolve, reject) => {
            AMapLocation.locationWithCompletion(result => resolve(result));
        });
    }

    static async locationAuthorizedDenied() {
        return new Promise((resolve, reject) => {
            AMapLocation.locationAuthorizedDenied(result => resolve(result));
        });
    }
}