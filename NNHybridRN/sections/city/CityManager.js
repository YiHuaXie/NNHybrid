import React from 'react';
import { NativeModules } from 'react-native';
import Network from '../../network';
import { ApiPath } from '../../network/ApiService';
import StorageUtil from '../../storage';
import AppUtil from '../../utils/AppUtil';

const cityManager = NativeModules.CityManagerModule;
export const VISITED_CITIES = 'visited_cities';

export default class CityManager {

    constructor() {
        this.instance;
    }

    static shareInstance() {
        return this.instance || (this.instance = new CityManager());
    }

    static syncVisitedCities() {
        const tmp = [];
        StorageUtil.load(VISITED_CITIES, data => {
            for (const i in data) {
                for (const ii in object) {

                }
            }

            StorageUtil.save(VISITED_CITIES, tmp);
        });
    }

    static addVisitedCity(city) {
        let newData = [];

        StorageUtil.getAllDataForKey(VISITED_CITIES, data => {
            newData = Array.from(data);
            if (AppUtil.isEmptyArray(data)) {
                newData.push(city);

                return;
            }

            let index = -1;
            for (const i in data) {
                if (data[i].cityName === city.cityName) {
                    index = i;
                    break;
                }
            }

            if (index < 0) {
                newData.splice(0, 0, city);
                if (newData.length > 2) {
                    newData.pop();
                }
            } else if (index > 0) {
                newData.splice(index, 1);
                newData.splice(0, 0, city);
            }

            StorageUtil.save(VISITED_CITIES, newData);
        });
    }

    static loadHaveHouseCityList(callBack) {
        return Network
            .my_request(ApiPath.HOME, 'homeCityList', '1.0', { appType: '1' })
            .then(response => {
                callBack(null, response.normalCityList, response.hotCityList);
                return response;
            })
            .catch(error => {
                callBack(error);
            });
    }

    static cityLocation(callBack) {
        cityManager.cityLocation((cityName, cityId) => {
            callBack(cityName, cityId);
        });
    }
}