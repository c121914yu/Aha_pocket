import request from "./request.js"

/* 
	购买附件-创建订单
	@params data.projectId:Int 项目ID
	@params data.resourceId:Array 购买的附件id
*/
const postOrder = (data) => request("/contribPoint/order","POST",data)
/* 
	付款/取消付款
	@params ordetrId:Int 订单ID
	@params action:String,取值pay/cancel
*/
const putOrder = (orderId,action) => request(`/contribPoint/order/${orderId}?action=${action}`,"PUT",{})

/* 获取贡献点变化 */
const getPointOrder = (params) => request("/contribPoint/log/me","GET",params)

/* 获取个人订单信息 */
const getOrders = (params) => request("/contribPoint/order/me","GET",params)
/* 获取订单详细 */
const getOrder = (orderId) => request(`/contribPoint/order/${orderId}`,"GET",{})
/* 判断资源是否购买 */
const checkResourcePurchased = (projectId) => request(`/project/purchased/${projectId}`,"GET",{})

/* 获取统一下单ID */
const getPrepay_id = (data) => request("/order/unifiedorder","POST",data)

export {
	postOrder,
	putOrder,
	
	getPointOrder,
	getOrders,
	getOrder,
	checkResourcePurchased,
	getPrepay_id
}