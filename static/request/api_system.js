import request from "./request.js"

/* 获取系统公告 */
exports.getNotice = () => request("/notice","GET",{})
/* 获取我的反馈 */
exports.getFeedbackMe = (param) => request("/feedback/me","GET",param)
/* 反馈问题 */
exports.feedbackProblem = (data) => request("/feedback","POST",data)
/* 获取轮播图 */
exports.getSlideCard = () => request("/slideShow","GET",{})
/* 使用兑换码 */
exports.useCDKEY = (code) => request("/activity/code?code="+code,"POST",{})

/* 获取公共上传签名 */
exports.getPublicSignature = (filename) => request("/project/sign/upload/public?filename="+filename,"GET",{})
