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
			timeout: 10000,
			success(result) 
			{
				/* 请求成功 */
				if(result.data.code === 200)
				{
					resolve(result.data)
				}
				/* 请求错误 */
				else
				{
					console.log("请求错误")
					console.log(result.data)
					/* 如果是token过期，关闭所有界面回到登录页 */
					if(result.data.code === 103){
						// 如果token跟缓存的相同，说明没有被重置过，是真正的过期
						if(token === uni.getStorageSync("token")){
							uni.clearStorageSync("token")
							uni.reLaunch({
								url: "/pages/Login/Login",
								success: () => {
									Vue.prototype.gToastError(result.data.msg)
								}
							})
						}
						// 如果token跟缓存不同，说明token是被重置过的，不是真正过期
						else{
							resolve(myRequest(url,method,data))
						}
					}
					else if(result.data.msg){
						Vue.prototype.gToastError(result.data.msg)
					}
					else{
						Vue.prototype.gToastError("服务器异常")
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
					console.log(result.header.Authorization);
					uni.setStorageSync("token",result.header.Authorization)
				}
			}
		})
	})
}
export default myRequest