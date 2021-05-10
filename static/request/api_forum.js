import request from "./request.js"

/**
 * 策略获取人才
 */
exports.getTalents = () => request("/talentMarket","GET",{})
