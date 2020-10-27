import request from "./request.js"

/* 
	description: 更新简历信息
	input: resume: Object,简历的所有字段
*/
const putResume = (data) => request("/resume","PUT",data)
/* 
	description: 获取简历信息
	input: resume: Object,简历的所有字段
*/
const getResume = (phone) => request("/resume/" + phone,"GET",{})


export {
	putResume,
	getResume
}