import React from 'react';
import { NativeModules } from 'react-native';
import Network from '../../network';
import { ApiPath } from '../../network/ApiService';
import StorageUtil from '../../storage';
import AppUtil from '../../utils/AppUtil';

const AMapLocation = NativeModules.AMapLocationModule;
const UserDefault = NativeModules.UserDefaultModule;

const defaultCityName = '杭州市';
const defaultCityId = '330100';

const VISITED_CITIES = 'visitedCities';
const SELECTED_CITY = 'selectedCity';
const LOCATION_CITY = 'locationCity';


export default class CityManager {

    constructor() {
        this.instance;
        this.haveHouseCities;
        this.hotCities;
    }

    static shareInstance() {
        return this.instance || (this.instance = new CityManager());
    }

    static getSelectedCity() {
        return StorageUtil.objectForKey(SELECTED_CITY);
    }

    static getLocationCity() {
        return StorageUtil.objectForKey(SELECTED_CITY);
    }

    static getVisitedCities() {
        return StorageUtil.objectForKey(VISITED_CITIES);
    }

    static getHaveHouseCities() {
        return this.shareInstance().haveHouseCities;
    }

    static getHotCities() {
        return this.shareInstance().hotCities;
    }

    static async syncVisitedCities(haveHouseCities) {
        let tmp = [];
        let original = null;
        try {
            original = await StorageUtil.objectForKey(VISITED_CITIES);
            for (const i in original) {
                for (const ii in haveHouseCities) {
                    if (haveHouseCities[ii].cityName === original[i].cityName) {
                        tmp.push(original[i]);
                    }
                }
            }

            await StorageUtil.save(VISITED_CITIES, tmp);
        } catch (e) {
            console.log(e);
        }
    }

    static async addVisitedCity(city) {
        let tmp = null;
        try {
            tmp = await StorageUtil.objectForKey(VISITED_CITIES);
            tmp = AppUtil.makeSureArray(tmp);

            if (!tmp.length) {
                tmp.push(city);
            } else {
                let index = -1;
                for (const i in tmp) {
                    if (tmp[i].cityName === city.cityName) {
                        index = i;
                        break;
                    }
                }

                if (index < 0) {
                    tmp.splice(0, 0, city);
                    if (tmp.length > 3) {
                        tmp.pop();
                    }
                } else if (index > 0) {
                    tmp.splice(index, 1);
                    tmp.splice(0, 0, city);
                }
            }

            console.log(tmp);
            await StorageUtil.save(VISITED_CITIES, tmp);
        } catch (e) {
            console.log(e);
        }
    }

    static loadHaveHouseCityList(callBack) {
        return Network
            .my_request({
                apiPath: ApiPath.HOME,
                apiMethod: 'homeCityList',
                apiVersion: '1.0',
                params: { appType: '1' }
            })
            .then(response => {
                this.shareInstance().haveHouseCities = response.normalCityList;
                this.shareInstance().hotCities = response.hotCityList;
                this.syncVisitedCities(response.normalCityList);
                callBack(null, response.normalCityList, response.hotCityList);

                return response;
            })
            .catch(error => {
                callBack(error);
            });
    }

    static async _getCityIdWithCityName(cityName) {
        try {
            await UserDefault.objectForKey('kInitCityList', data => {
                for (const i in data) {
                    const { name, id } = data[i];
                    if (name === cityName) {
                        return `${id}`;
                    }
                }
            });
        } catch (e) {
            return '';
        }
    }

    static saveSelectedCity(cityName, cityId) {
        StorageUtil.save(SELECTED_CITY, { cityName, cityId });
    }

    static saveLocationCity(cityName, cityId) {
        StorageUtil.save(LOCATION_CITY, { cityName, cityId });
    }

    static cityLocation(callBack) {
        const selectedCity = this.getSelectedCity();
        if (selectedCity) {
            callBack(selectedCity.cityName, selectedCity.cityId);
            return;
        }

        AMapLocation.locationWithCompletion(params => {
            const { error, province, city } = params;
            let cityName = city.length ? city : province;
            let cityId = this._getCityIdWithCityName(cityName);

            if (!cityName.length || !cityId || !cityId.length || cityId === '000000' || error) {
                cityName = defaultCityName;
                cityId = defaultCityId;
            } else {
                this.saveLocationCity(cityName, cityId);
            }

            this.saveSelectedCity(defaultCityName, defaultCityId);
            this.addVisitedCity({ cityName: defaultCityName, cityId: defaultCityId });
            callBack(defaultCityName, defaultCityId);
        });
    }
}