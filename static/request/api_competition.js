import request from "./request.js"

/*  获取所有竞赛信息 */
const getAllCompetition= () => request("/competition","GET",{})

export {
	getAllCompetition
}