import request from "./request.js"

/* 
	description: 获取个人信息
	input: null
	return: null
*/
const getMe = (data) => request("/userInfo/me","GET",data)
/* 
	description: 签署须知协议
*/
const signNotice = (data) => request("/sign/notice","GET",data)
/* 
	description: 获取头像上传签名
*/
const getAvatarOssSignature = (data) => request("/resource/sign/upload/public","GET",data)
/* 
	description: 修改个人基本资料
	input:
				nickname: String,昵称
*/
const putMe = (data) => request("/userInfo/me","PUT",data)

export {
	getMe,
	signNotice,
	getAvatarOssSignature,
	putMe
}