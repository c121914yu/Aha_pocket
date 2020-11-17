import request from "./request.js"

/* 获取个人信息 */
const getMe = (data) => request("/userInfo/me","GET",data)
/* 修改个人基本资料 */
const putMe = (data) => request("/userInfo/me","PUT",data)
/* 签署须知协议 */
const signNotice = (data) => request("/sign/notice","GET",data)
/* 获取头像上传签名 */
const getAvatarOssSignature = (data) => request("/userInfo/avatar/sign/upload","GET",data)

export {
	getMe,
	putMe,
	signNotice,
	getAvatarOssSignature,
}