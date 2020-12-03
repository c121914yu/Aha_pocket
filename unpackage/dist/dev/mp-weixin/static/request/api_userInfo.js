import request from "./request.js"

/* 获取个人信息 */
const getMe = (data) => request("/userInfo/me","GET",data)
/* 修改个人基本资料 */
const putMe = (data) => request("/userInfo/me","PUT",data)
/* 签署须知协议 */
const signNotice = () => request("/sign/notice","POST",{})
/* 获取头像上传签名 */
const getAvatarOssSignature = (data) => request("/userInfo/avatar/sign/upload","GET",data)
/* 根据userId获取用户详细信息 */
const getUser = (userId) => request("/userInfo/" + userId,"GET",{})
/* 获取消息通知列表 */
const getMessages = (param) => request("/message","GET",param)

export {
	getMe,
	putMe,
	signNotice,
	getAvatarOssSignature,
	
	getUser,
    
    getMessages,
}