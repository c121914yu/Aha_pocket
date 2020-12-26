import request from "./request.js"

/* 获取系统公告 */
const getNotice = () => request("/notice","GET",{})
/* 获取我的反馈 */
const getFeedbackMe = (param) => request("/feedback/me","GET",param)
/* 反馈问题 */
const feedbackProblem = (data) => request("/feedback","POST",data)

export{
	getNotice,
	getFeedbackMe,
	feedbackProblem
}