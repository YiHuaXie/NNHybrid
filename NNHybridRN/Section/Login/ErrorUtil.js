export default class ErrorUtil {
    static phoneInvalid() {
        return new Error('请输入11位手机号');
    }
 
    /**
     * 密码验证
     * @param {String} password 
     */
    static passwordValid(password) {
        return password && password.length >=6 && password.length<=20 ? true : false;
    }
}