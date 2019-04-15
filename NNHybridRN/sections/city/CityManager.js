import React from 'react';
import { NativeModules } from 'react-native';
import Network from '../../network';
import { ApiPath } from '../../network/ApiService';

const cityManager = NativeModules.CityManagerModule;

export default class CityManager {

    constructor() {
        this.instance;
    }

    static shareInstance() {
        return this.instance || (this.instance = new CityManager());
    }

    static loadHaveHouseCityList() {
        return Network
            .my_request(ApiPath.HOME, 'homeCityList', '1.0', { appType: '1' })
            .then(response => {

                return response;
            })
            .catch(error => { throw error });
    }

    static syncVisitedCities() {

    }


    static cityLocation(callBack) {
        cityManager.cityLocation((cityName, cityId) => {
            callBack(cityName, cityId);
        });
    }
}