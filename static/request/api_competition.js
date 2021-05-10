import request from "./request.js"

/**
 * 获取所有竞赛信息
 */
exports.getAllCompetition= () => request("/competition","GET",{})
