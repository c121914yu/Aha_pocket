/* 订单相关 */
import request from "./request.js"

/**
 * 创建订单
 * @param {Number}  prohjectId 项目ID
 * @param {Array}   resourceId 购买的附件id
 */
exports.postOrder = (data) => request("/contribPoint/order","POST",data)

/**
 * 付款/取消付款
 * @param {Number}  orderId 订单ID
 * @param {String} action 取值pay，cancel 
 */
exports.putOrder = (orderId,action) => request(`/contribPoint/order/${orderId}?action=${action}`,"PUT",{})

/**
 * 获取个人贡献点变化日志
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {String}  sortBy 排序参考，取值time,type,contribPoint,ahaPoint,ahaCredit
 * @param {String}  orderBy 排序方式，取值desc,asc默认desc
 */
exports.getPointOrder = (params) => request("/contribPoint/log/me","GET",params)

/**
 * 获取个人全部订单
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 */
exports.getOrders = (params) => request("/contribPoint/order/me","GET",params)

/**
 * 获取订单详细
 * @param {Number}  orderId 订单ID
 */
exports.getOrder = (orderId) => request(`/contribPoint/order/${orderId}`,"GET",{})

/**
 * 获取已购买的附件数组
 * @param {Number}  projectId
 */
exports.checkResourcePurchased = (projectId) => request(`/project/purchased/${projectId}`,"GET",{})
