import request from "./request.js"

/* 
	购买附件-创建订单
	@params projectId:Int 项目ID
	@params resourceId:Array 购买的附件id
*/
const postOrder = (data) => request("/order","POST",data)
/* 
	付款/取消付款
	@params ordetrId:Int 订单ID
	@params action:String,取值pay/cancel
*/
const putOrder = (orderId,action) => request(`/order/${orderId}?action=${action}`,"PUT",{})
/* 获取个人订单信息 */
const getOrders = () => request("/order/me","GET",{})
/* 获取订单详细 */
const getOrder = (orderId) => request(`/order/${orderId}`,"GET",{})
/* 判断资源是否购买 */
const checkResourcePurchased = (projectId) => request(`/project/purchased/${projectId}`,"GET",{})

export {
	postOrder,
	putOrder,
	getOrders,
	getOrder,
	checkResourcePurchased
}