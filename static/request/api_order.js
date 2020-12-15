import request from "./request.js"

/* 购买项目 */
const buyProject = (projectId) => request(`/project/buy/${projectId}`,"GET",{})
/* 获取个人订单信息 */
const getOrders = () => request("/order/me","GET",{})
/* 获取订单详细 */
const getOrder = (orderId) => request(`/order/${orderId}`,"GET",{})

export {
	buyProject,
	
	getOrders,
	getOrder
}