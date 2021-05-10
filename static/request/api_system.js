import request from "./request.js"

/**
 * 获取系统公告
 */
exports.getNotice = () => request("/notice","GET")

/**
 * 签署须知协议
 */
exports.signNotice = () => request("/sign/notice","POST")

/**
 * 获取我的反馈
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {Number}  status 状态
 * @param {Number}  type 类型
 * @param {Number}  lowestLevel 最低级别
 * @param {Number}  highestLevel 最高级别
 * @param {String}  sortBy 排序关键字time、status、type、level、replyTime
 * @param {String}  orderBy 排序方式
 */
exports.getFeedbackMe = (param) => request("/feedback/me","GET",param)

/**
 * 用户提交反馈
 * @param {Number}  type 反馈类型
 * @param {String}  content
 */
exports.feedbackProblem = (data) => request("/feedback","POST",data)

/**
 * 获取轮播图
 */
exports.getSlideCard = () => request("/slideShow","GET")

/**
 * 使用兑换码
 * @param {String}  code 兑换码
 */
exports.useCDKEY = (code) => request(`/activity/code?code=${code}`,"POST")

/**
 * 获取公共上传签名
 * @param {String}  filename
 */
exports.getPublicSignature = (filename) => request("/project/sign/upload/public?filename="+filename,"GET")
