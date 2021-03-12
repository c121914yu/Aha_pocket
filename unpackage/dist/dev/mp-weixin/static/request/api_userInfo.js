import request from "./request.js"


/* 
	name: 绑定手机号
	@params phone: String
	@params code: String
*/
const bindPhone = (data) => request("/bind/phone","POST",data)
/* 绑定微信号 */
const bindWxchat = (data) => request("/bind/wechat?code="+data.code,"POST",data)

/* 获取个人信息 */
const getMe = () => request("/userInfo/me","GET",{})
/* 修改个人基本资料 */
const putMe = (data) => request("/userInfo/me","PUT",data)
/* 签署须知协议 */
const signNotice = () => request("/sign/notice","POST",{})
/* 获取头像上传签名 */
const getAvatarOssSignature = (filename) => request("/userInfo/avatar/sign/upload?filename="+filename,"GET",{})
/* 根据userId获取用户详细信息 */
const getUser = (userId) => request("/userInfo/" + userId,"GET",{})

/* 
	desc: 获取简历信息
	@param userId: String,用户标识码
*/
const getResume = (userId) => request(`/resume/${userId}`,"GET",{})

/* 
	desc: 更新简历信息
	@params resume: Object,简历的所有字段
*/
const putResume = (data) => request("/resume","PUT",data)

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
const getPurchased = () => request("/project/resource/purchased","GET",{})

/* 获取公共文件上次接口 */
const getPublicFileSign = (filename) => request("/cos/sign/upload/public?filename="+filename,"GET",{})

/* 获取个人统计数据 */
const getSelfStatistice = () => request("/statistics/me","GET",{})
/* 获取指定用户统计数据 */
const getUserStatistice = (userId) => request(`/statistics/${userId}`,"GET",{})

/* 获取实名认证上传签名 */
const getAuthenticationSignature = (filename) => request(`/authentication/sign/upload?filename=${filename}`,"GET",{})
/* 提交实名认证信息 */
const putAuthentication = (data) => request(`/authentication/updatePersonalAuthentication`,"PUT",data)

export {
	bindPhone,
	bindWxchat,
	
	getMe,
	putMe,
	signNotice,
	getAvatarOssSignature,
	
	getUser,
	getResume,
	putResume,
    
    getUnreadCount,
    getMessages,
	getMessage,
    postMessage,
	deleteMessage,
	
	getCollectedProjects,
	getPurchased,
	
	getPublicFileSign,
	getSelfStatistice,
	getUserStatistice,
	getAuthenticationSignature,
	putAuthentication
}