import React from 'react';
import { NativeModules } from 'react-native';
import Network from '../../network';
import { ApiPath } from '../../network/ApiService';
import StorageUtil from '../../storage';
import AppUtil from '../../utils/AppUtil';

const cityManager = NativeModules.CityManagerModule;
const VISITED_CITIES = 'visitedCities';

export default class CityManager {

    constructor() {
        this.instance;
        this.haveHouseCities;
        this.hotCities;
    }

    static shareInstance() {
        return this.instance || (this.instance = new CityManager());
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

            StorageUtil.save(VISITED_CITIES, tmp);
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

            StorageUtil.save(VISITED_CITIES, tmp);
        } catch (e) {
            console.log(e);
        }
    }

    static loadHaveHouseCityList(callBack) {
        return Network
            .my_request(ApiPath.HOME, 'homeCityList', '1.0', { appType: '1' })
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

    static cityLocation(callBack) {
        cityManager.cityLocation((cityName, cityId) => {
            this.addVisitedCity({ cityName, cityId });
            callBack(cityName, cityId);
        });
    }
}