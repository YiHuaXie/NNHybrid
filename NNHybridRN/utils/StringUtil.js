
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

    static houseDirection(number) {
        switch (number) {
            case 1:
                return '朝南'
            case 2:
                return '朝北'
            case 3:
                return '朝东'
            case 4:
                return '朝西'
            case 5:
                return '东南'
            case 6:
                return '西南'
            case 7:
                return '东北'
            case 8:
                return '西北'
            default:
                return ''
        }
    }
}