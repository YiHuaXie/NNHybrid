import { NativeModules } from 'react-native';
import { CodeType, EnvironmentType, baseUrl } from './ApiService';
import DeviceInfo from 'react-native-device-info';

const AppDeviceModule = NativeModules.AppDeviceModule;

export const HttpMethod = {
    GET: 'GET',
    POST: 'POST'
};

const my_baseUrl = baseUrl(EnvironmentType.PRODUCTION);

let header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

/**
 * 网络请求超时处理
 * @param {*} originalFetch 
 * @param {*} timeout 超时时间，默认为10s
 */
const timeoutFetch = (originalFetch, timeout = 10000) => {
    return Promise.race([
        originalFetch,
        new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('request timeout')), timeout);
        })
    ]);
}

/**
 * URL拼接
 * @param {*} url 
 * @param {{}} params 
 */
export const handleUrl = (url, params) => {
    if (params && typeof (params) === 'object') {
        const paramsArray = []
        Object.keys(params).forEach(key => {
            paramsArray.push(`${key}=${encodeURIComponent(params[key])}`);
        });
        return url.search(/\?/) === -1 ?
            `${url}?${paramsArray.join('&')}` :
            `${url}&${paramsArray.join('&')}`;
    }

    return url;
}

export default class Network {

    /**
     * GET请求
     * @param {string} url 
     * @param {{}} params 
     */
    static getRequest(url, params) {
        let originalFetch = fetch(handleUrl(url, params), {
            method: httpMethod.GET,
            headers: header,
        });

        return Network.request(originalFetch);
    }

    /**
     * POST请求
     * @param {string} url 
     * @param {{}} params 
     */
    static postRequest(url, params) {
        let originalFetch = fetch(url, {
            method: HttpMethod.POST,
            headers: header,
            body: JSON.stringify(params)
        });

        return Network.request(originalFetch);
    }

    /**
     * 
     * @param {fetch} aFetch 
     */
    static request(aFetch) {
        return timeoutFetch(aFetch)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                // respose.status
                throw new Error('Network response was error');
            })
            .catch(error => {
                return error;
            });
    }

    /**
     * 麦邻租房请求
     * 
     * @param {{apiPath:string, apiMethod: string, apiVersion: string, httpMethod: HttpMethod, params:{}, needLogin:boolean }} parameters  
     */
    static my_request(parameters) {
        const {
            apiPath,
            apiMethod,
            apiVersion,
            params = {},
            needLogin = false,
            httpMethod = HttpMethod.POST
        } = parameters;

        if (needLogin) {
            // 显示登录弹窗
            return null;
        }

        let finalUrl = `${my_baseUrl}${apiPath}`;
        let finalParams = {
            v: apiVersion,
            method: apiMethod,
            reqId: 'abcd',
            timestamp: `${new Date().getTime()}`,
            appVersionNum: DeviceInfo.getVersion(),
            sysVersionNum: DeviceInfo.getSystemVersion(),
            manufacturerBrand: DeviceInfo.getManufacturer(),
            equType: DeviceInfo.getModel(),
            params,
        };

        let promise = httpMethod === HttpMethod.GET ?
            this.getRequest(finalUrl, finalParams) :
            this.postRequest(finalUrl, finalParams);

        return promise
            .then(response => {
                response.code = parseInt(response.code);
                if (response.code === 1011) response.code = 0;

                switch (response.code) {
                    case CodeType.SUCCESS:
                        return response.data;
                    case CodeType.OTHER_DEVICE:
                    case CodeType.SESSION_LOSE:
                    case CodeType.AUTH_FAILED:
                        throw new Error('会话丢失请重新登录');
                    default:
                        throw new Error(response.message);
                }
            })
            .catch(error => { throw error; });
    }
}