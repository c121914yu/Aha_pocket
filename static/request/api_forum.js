import request from "./request.js"

/**
 * 策略获取人才
 */
exports.getTalents = (params) => request("/talentMarket","GET",params)
