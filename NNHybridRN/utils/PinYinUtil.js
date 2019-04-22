import pinyin from 'pinyin';
import AppUtil from './AppUtil';

const getENFunc = () => {
    const tmp = [];

    for (let i = 65; i < 91; i++) {
        tmp.push(String.fromCharCode(i));
    }

    return tmp;
};

const pinyinCompare = (string1, string2) => {
    const tmp1 = PinYinUtil.allFirstLetter(string1);
    const tmp2 = PinYinUtil.allFirstLetter(string2);
    if (tmp1 > tmp2) {
        return 1;
    } else if (tmp1 < tmp2) {
        return -1;
    } else {
        return 0;
    }
}

const getEN = getENFunc();

export default class PinYinUtil {

    /**
     * 中文转全拼，例如“你好”，返回“NIHAO”
     * 如果是英文，例如“string”，返回“STRING”
     * 
     * @param {string} string 
     */
    static quanPin(string) {
        return pinyin(string, {
            style: pinyin.STYLE_NORMAL,
            heteronym: false, //禁止多音字
        }).join('').toUpperCase();
    }

    static firstLetter(string) {
        return this.allFirstLetter(string).substr(0, 1);
    };

    static allFirstLetter(string) {
        if (!string) return '';

        let tmpString = string.replace(/\ +/g, '');
        tmpString = tmpString.replace(/[\r\n]/g, '');

        return pinyin(tmpString, {
            style: pinyin.STYLE_FIRST_LETTER,
            heteronym: false,
        }).join('').toUpperCase();
    }

    static arrayWithFirstLetterFormat(array, stringInElement) {
        if (AppUtil.isEmptyArray(array)) return [];

        const dict = {};
        for (const i in getEN) {
            dict[getEN[i]] = [];
        }

        for (const i in array) {
            const element = stringInElement ? stringInElement(array[i]) : array[i];
            const firstLetter = this.firstLetter(element);
            const tmpArray = AppUtil.makeSureArray(dict[firstLetter]);
            tmpArray.push(array[i]);
        }
        const resultArray = [];
        for (const i in getEN) {
            const firstLetter = getEN[i];
            const array = dict[firstLetter];
            if (array.length) {
                const data = array.sort((element1, element2) => {
                    const string1 = stringInElement ? stringInElement(element1) : element1;
                    const string2 = stringInElement ? stringInElement(element2) : element2;

                    return pinyinCompare(string1, string2);
                });
                const resultDict = { firstLetter, data };
                resultArray.push(resultDict);
            }
        }

        return resultArray;
    }
}

/**
 *         console.log(PinYinUtil.firstLetter(null));
        console.log(PinYinUtil.firstLetter(''));
        console.log(PinYinUtil.firstLetter('你好'));
        console.log(PinYinUtil.firstLetter('M你好'));
        console.log(PinYinUtil.firstLetter('string'));
        console.log(PinYinUtil.firstLetter('@你好'));
        console.log(PinYinUtil.firstLetter('      @你好'));
        console.log(PinYinUtil.firstLetter('      n你好'));
        console.log(PinYinUtil.firstLetter('sssn你好ssss'));
 */