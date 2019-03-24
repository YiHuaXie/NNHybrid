export const HttpMethod = {
    GET: 'GET',
    POST: 'POST'
};

export const CodeType = {
    SUCCESS: 0, // 请求成功
    API_KEY_ERROR: 1, // 用户未登录
    INFO_ERROR: 4,
    THIRD_FAILED: 1006,
    OTHER_DEVICE: 1015,
    SESSION_LOSE: 1016,
    AUTH_FAILED: 1007,
};

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
        let paramsArray = []
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
                // console.log(response);
                if (response.ok) {
                    return response.json();
                }

                // respose.status
                throw new Error('Network response was error');
            })
            .then(responseData => {
                // console.log(responseData);
                resolve(responseData);
            })
            .catch(error => {
                // console.log(error);
                reject(error);
            });
    }

    /**
     * 麦邻租房请求
     * @param {HttpMethod} httpMethod  // 请求类型
     * @param {string} path            // 接口路径
     * @param {string} apiMethod       // 接口方法名
     * @param {string} apiVersion      // 接口版本号
     * @param {{}} params              // 业务参数
     * @param {boolean} needLogin      // 是否登录
     */
    static my_request(httpMethod, path, apiMethod, apiVersion, params, needLogin = NO) {
        if (needLogin) {
            // 显示登录弹窗
            return null;
        }

        let finalUrl = '';
        let finalParams = {};

        let promise = httpMethod === HttpMethod.GET ?
            this.getRequest(finalUrl, finalParams) :
            this.postRequest(finalUrl, finalParams);

        promise.then(response => {
            if (response.code === 1011) response.code = CodeType.SUCCESS;

            if (response.code === CodeType.SUCCESS) {
                resolve(response.data);
            } else if (response.code === CodeType.OTHER_DEVICE || CodeType.SESSION_LOSE || CodeType.AUTH_FAILED) {

            }

            throw new Error(response.message);
        })
            .catch(error => reject(error));
    }
}