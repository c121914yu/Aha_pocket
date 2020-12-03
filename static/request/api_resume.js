import request from "./request.js"

/* 
	description: 获取简历信息
	params:
        userId: String,用户标识码
*/
const getResume = (userId) => request(`/resume/${userId}`,"GET",{})

/* 
	description: 更新简历信息
	input: resume: Object,简历的所有字段
*/
const putResume = (data) => request("/resume","PUT",data)



export {
  getResume,
	putResume,
}