import request from "./request.js"

/* 
	description: 发送验证码
	input: 
				phone: String,手机号
        type: String,取值register、changePassword、bindPhone
	return: null
*/
const sendCode = (data) => request(`/sms/code`,"POST",data)

/* 
	description: 用户注册
	input: 
				phone: String,手机号
				password: String,密码
				code: String,验证码
	return: 
				token: String
				userInfo: Object,用户信息
*/
const Register = (data) => request("/register/phone","POST",data)

/* 
	description: 修改密码
	input: 
				newPassword: String,新密码
				code: String,验证码
	return: null
*/
const ChangePassword = (data) => request(`/changePassword/phone/${data.phone} `,"POST",data)

/* 
	description: 用户手机登录
	input: 
				phone: String,手机号
				password: String,密码
	return: 
				token: String
				userInfo: Object,用户信息
*/
const Login = (data) => request("/login/phone","POST",data)

/* 
	description: 微信登录
	input: 
				code: String,微信用户表示码
	return: 
				token: String
				userInfo: Object,用户信息
*/
const WXLogin = (data) => request("/login/wechat","POST",data)

/* 退出登录 */
const loginOut = () => request("/logout ","GET",{})

export {
	sendCode,
	Register,
	ChangePassword,
	Login,
	WXLogin,
  loginOut
}