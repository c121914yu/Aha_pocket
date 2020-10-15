import request from "./request.js"

/* 
	description: 获取个人信息
	input: null
	return: null
*/
const getMe = (data) => request("/userInfo/me","GET",data)

export {
	getMe
}