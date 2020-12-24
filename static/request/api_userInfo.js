import request from "./request.js"

/* 
	name: 绑定手机号
	params:
			phone: String
			code: String
*/
const bindPhone = (data) => request("/bind/phone","POST",data)
/* 绑定微信号 */
const bindWxchat = (data) => request("/bind/wechat?code="+data.code,"POST",data)

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

/* 获取未读通知数量 */
const getUnreadCount = () => request("/message/count/notRead","GET",{})
/* 获取消息通知列表 */
const getMessages = (param) => request("/message","GET",param)
/* 
	获取消息通知内容
	@param: messageId: Number
*/
const getMessage = (messageId) => request(`/message/${messageId}`,"GET",{})
/* 
    发送通知
    @params: receiverUserId: Number,收件人用户id
    @params: title: String, 信件标题
    @params: content:String, 信件内容
*/
const postMessage = (data) => request("/message","POST",data)
/*  删除消息 */
const deleteMessage = (messageId) => request(`/message/${messageId}`,"DELETE",{})

/* 获取个人收藏项目 */
const getCollectedProjects = () => request("/project/collection","GET",{})
/* 获取个人购买的项目附件 */
const getPurchasedProject = () => request("/project/resource/purchased","GET",{})

export {
	bindPhone,
	bindWxchat,
	
	getMe,
	putMe,
	signNotice,
	getAvatarOssSignature,
	
	getUser,
    
    getUnreadCount,
    getMessages,
	getMessage,
    postMessage,
	deleteMessage,
	
	getCollectedProjects,
	getPurchasedProject
}