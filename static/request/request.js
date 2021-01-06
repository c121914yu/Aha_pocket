import Vue from 'vue'
const baseUrl = getApp().globalData.baseUrl

function myRequest(url,method,data){
	/* 配置请求头 */
	const token = uni.getStorageSync("token") || ''
	const headers = {
		"Content-Type": "application/json; charset=utf-8",
		'Authorization': token
	}
	
	return new Promise((resolve,reject) => {
		uni.request({
			url: baseUrl + url,
			method: method,
			data: data,
			header: headers,
			success(result) 
			{
				/* 请求成功 */
				if(result.data.code === 200)
				{
					// console.log(result.header)
					resolve(result.data)
				}
				/* 请求错误 */
				else
				{
					console.log("请求错误")
					console.log(result.data)
					Vue.prototype.gToastError(result.data.msg)
					/* 如果是token过期，关闭所有界面回到登录页 */
					if(result.data.code === 103){
						uni.clearStorageSync("token")
						uni.reLaunch({
							url: "/pages/Login/Login",
							success: () => {
								Vue.prototype.gToastError(result.data.msg)
							}
						})
					}
					reject(result.data)
				}
			},
			fail(err) 
			{
				console.log("服务器错误")
				console.log(err.data)
				Vue.prototype.gToastError("服务器错误")
				reject(err)
			},
			complete(result) {
				/* 判断是否有新token,有则替换旧的token */
				if(result.header.Authorization){
					console.log(result.header);
					uni.setStorageSync("token",result.header.Authorization)
				}
			}
		})
	})
}
export default myRequest