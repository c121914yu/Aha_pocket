import request from "./request.js"

/**
 * 绑定手机号
 * @param {String}  phone
 * @param {String}  code 验证码
 */
exports.bindPhone = (data) => request("/bind/phone","POST",data)

/**
 * 绑定微信号
 * @param {String}  code 用户code码
 */
exports.bindWxchat = (code) => request(`/bind/wechat?code=${code}`,"POST")

/**
 * 获取个人信息
 */
exports.getMe = () => request("/userInfo/me","GET")

/**
 * 修改个人基本资料
 * @param {Number}  userId
 * @param {String}  nickname
 * @param {String}  avatarUrl
 */
exports.putMe = (data) => request("/userInfo/me","PUT",data)

/**
 * 根据userId获取用户详细信息
 * @param {Number}  userId
 */
exports.getUser = (userId) => request(`/userInfo/${userId}`,"GET")

/**
 * 获取简历信息
 * @param {Number}  userId
 */
exports.getResume = (userId) => request(`/resume/${userId}`,"GET")

/**
 * 更新简历信息
 * @param {Number}  userId
 * @param {String}  name,phone,email,gender,birth,highestDegree,identity,currentGrade,workPlace,profession,projectSkill,intro
 * @param {Array}  eduExperiences,schoolExperiences,projectExperiences,practiceExperiences,honors
 */
exports.putResume = (data) => request("/resume","PUT",data)

/**
 * 获取未读通知数量
 */
exports.getUnreadCount = () => request("/message/count/notRead","GET",{})

/**
 * 获取消息通知列表
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {Number}  status 0-未读 1-已读
 * @param {String}  type system-系统，private-私信
 */
exports.getMessages = (param) => request("/message","GET",param)

/**
 * 获取消息通知内容
 * @param {Number}  messageId
 */
exports.getMessage = (messageId) => request(`/message/${messageId}`,"GET")

/**
 * 发送通知
 * @param {Number}  receiverUserId 收件人用户id
 * @param {String}  title
 * @param {String}  content
 */
exports.postMessage = (data) => request("/message","POST",data)

/**
 * 删除消息
 * @param {Number}  messageId
 */
exports.deleteMessage = (messageId) => request(`/message/${messageId}`,"DELETE")

/**
 * 获取个人收藏项目
 */
exports.getCollectedProjects = () => request("/project/collection","GET")

/**
 * 获取个人购买的项目附件
 */
exports.getPurchased = () => request("/project/resource/purchased","GET")

/**
 * 获取个人统计数据
 */
exports.getSelfStatistice = () => request("/statistics/me","GET")

/**
 * 获取指定用户统计数据
 * @param {Number}  userId
 */
exports.getUserStatistice = (userId) => request(`/statistics/${userId}`,"GET")

/**
 * 获取用户轨迹
 * @param {Number}  userId
 * @param {Number}  type
 */
exports.getUserTracks = (userId,type) => request(`/user/track/${userId}?type=${type}`,"GET")

/**
 * 获取实名认证上传签名
 * @param {String}  filename
 */
exports.getAuthenticationSignature = (filename) => request(`/authentication/sign/upload?filename=${filename}`,"GET")

/**
 * 提交实名认证信息
 */
exports.putAuthentication = (data) => request(`/authentication/updatePersonalAuthentication`,"PUT",data)

/**
 * 判断用户与自己关系
 * @param {Number}  userId 对方ID
 */
exports.getUserRelation = (userId) => request(`/user/relation/${userId}`,"GET")

/**
 * 关注用户
 * @param {Number}  userId 对方ID
 */
exports.followUser = (userId) => request(`/user/follow/${userId}`,"POST")

/**
 * 取消关注
 * @param {Number}  userId 对方ID
 */
exports.unfollowUser = (userId) => request(`/user/unfollow/${userId}`,"POST")