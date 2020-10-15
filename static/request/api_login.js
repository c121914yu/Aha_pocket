import request from "./request.js"

/* 
	description: 发送注册验证码
	input: 
				phone: String,手机号
	return: null
*/
const sendRegisterCode = (phone) => request("/sms/sendCode/register/"+phone,"GET",{})
/* 
	description: 发送修改密码验证码
	input: 
				phone: String,手机号
	return: null
*/
const sendChangePswCode = (phone) => request("/sms/sendCode/changePassword/"+phone,"GET",{})

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
const Register = (data) => request("/register","POST",data)

/* 
	description: 修改密码
	input: 
				phone: String,手机号
				password: String,密码
				code: String,验证码
	return: null
*/
const ChangePassword = (data) => request("/changePassword/"+data.phone,"POST",data)

/* 
	description: 用户手机登录
	input: 
				phone: String,手机号
				password: String,密码
	return: 
				token: String
				userInfo: Object,用户信息
*/
const Login = (data) => request("/login","POST",data)

/* 
	description: 微信登录
	input: 
				code: String,微信用户表示码
	return: 
				token: String
				userInfo: Object,用户信息
*/
const WXLogin = (data) => request("/wxLogin","POST",data)

export {
	sendRegisterCode,
	sendChangePswCode,
	Register,
	ChangePassword,
	Login,
	WXLogin,
}