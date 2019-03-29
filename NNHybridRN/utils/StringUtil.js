
export default class StringUtil {

    /**
     * 手机号验证
     * @param {String} phone 
     */
    static phoneValid(phone) {
        return phone && phone.length === 11 ? true: false
    }

    /**
     * 密码验证
     * @param {String} password 
     */
    static passwordValid(password) {
        return password && password.length >=6 && password.length<=20 ? true : false;
    }
}