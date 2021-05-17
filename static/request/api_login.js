/* 登录，注册，找回密码 */
import request from "./request.js"
/**
 * 发送验证码
 * @param {String}  phone
 * @param {String}  type 取值register、changePassword、bindPhone,对应不同方案
 */
exports.sendCode = (data) => request(`/sms/code`,"POST",data)

/**
 * 用户注册
 * @param {String}  phone
 * @param {String}  password
 * @param {String} code 验证码
 * @return {String} token 用户凭证
 * @return {Object} userInfo
 */
exports.Register = (data) => request("/register/phone","POST",data)

/**
 * 修改密码
 * @param {String}  newPassword
 * @param {String}  code
 */
exports.ChangePassword = (data) => request(`/changePassword/phone/${data.phone} `,"POST",data)

/**
 * 用户手机登录
 * @param {String}  phone
 * @param {String}  password
 * @return {String} token 用户凭证
 * @return {Object} userInfo
 */
exports.Login = (data) => request("/login/phone","POST",data)

/**
 * 微信登录
 * @param {String}  code 用户code值，通过微信api获取
 * @return {String} token 用户凭证
 * @return {Object} userInfo
 */
exports.WXLogin = (data) => request("/login/wechat","POST",data)

/**
 * 退出登录
 */
exports.loginOut = () => request("/logout ","GET",{})
