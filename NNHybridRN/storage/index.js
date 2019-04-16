import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

let size = 1000;
let defaultExpires = null;
let storage = undefined;

const createStorage = () => {
    storage = new Storage({
        size: size,
        storageBackend: AsyncStorage,
        defaultExpires: defaultExpires,
        enableCache: true,
        sync: {}
    });
}

const initStorage = () => {
    if (!storage) {
        createStorage();
    }
}

export default class StorageUtil {

    static save(key, obj) {
        initStorage();
        storage.save({
            key: key,
            data: obj,
            expires: defaultExpires
        });
    }

    static load(key, callBack) {
        initStorage();
        storage
            .load({
                key: key,
                autoSync: false,
                syncInBackground: true,
            })
            .then(ret => {
                callBack && callBack(ret);
                return ret;
            })
            .catch(error => {
                console.error(error);
                throw error;
            });
    }

    static remove(key) {
        initStorage();
        storage.remove({ key: key });
    }

    static getAllDataForKey(key, callback) {
        initStorage();
        storage
            .getAllDataForKey(key)
            .then(data => {
                callback && callback(null, data);
            })
            .catch(error => {
                callback(error);
            });
    }
}
