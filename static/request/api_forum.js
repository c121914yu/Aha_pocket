import request from "./request.js"

/* 获取用户列表 */
const getTalents = () => request("/talentMarket","GET",{})

export {
	getTalents
}