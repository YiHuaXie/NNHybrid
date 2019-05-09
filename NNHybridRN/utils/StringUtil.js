import AppUtil from "./AppUtil";

export default class StringUtil {

    /**
     * 手机号验证
     * @param {String} phone 
     */
    static phoneValid(phone) {
        return phone && phone.length === 11 ? true : false
    }

    /**
     * 密码验证
     * @param {String} password 
     */
    static passwordValid(password) {
        return password && password.length >= 6 && password.length <= 20 ? true : false;
    }

    static roomFloor(minFloor, maxFloor) {
        if (minFloor > 0) {
            if (maxFloor > minFloor) return `${minFloor}~${maxFloor}层`;
            if (maxFloor === minFloor) return `${minFloor}层`;
            return `${maxFloor}~${minFloor}层`;
        } else {
            return maxFloor > 0 ? `${maxFloor}层` : '暂无数据';
        }
    }

    static decorationDegree(type) {
        switch (type) {
            case 1:
                return '毛坯';
            case 2:
                return '简装';
            case 3:
                return '精装修';
            case 4:
                return '豪华装';
            default:
                return '暂无数据';
        }
    }

    static roomCount(number) {
        return number ? `${number}间` : '暂无数据';
    }

    static directionString(number) {
        switch (number) {
            case 1:
                return '朝南';
            case 2:
                return '朝北';
            case 3:
                return '朝东';
            case 4:
                return '朝西';
            case 5:
                return '东南';
            case 6:
                return '西南';
            case 7:
                return '东北';
            case 8:
                return '西北';
            default:
                return '暂无数据';
        }
    }

    static directionStrings(string) {
        if (AppUtil.isEmptyString(string)) return '暂无数据';

        const array = AppUtil.makeSureArray(string.split(","));
        const resultArray = [];
        array.forEach(item => {
            const tmp = this.directionString(parseInt(item));

            if (resultArray.indexOf(tmp) < 0 && tmp !== '暂无数据' && resultArray.length < 8) {
                resultArray.push(tmp);
            }

        });

        return resultArray.length ? resultArray.join('、') : '暂无数据';
    }

    
}