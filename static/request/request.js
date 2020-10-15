import globalFun from "../js/globalFun.js"
const baseUrl = "http://hdustea.f3322.net:8089"

function myRequest(url,method,data){
	uni.showLoading({
		title: "请求中...",
		mask: true
	})
	
	/* 配置请求头 */
	const token = uni.getStorageSync("token") || ''
	const headers = {
		"Content-Type": "application/json; charset=utf-8",
		'Authorization': token
	}
	
	return new Promise((res,rej) => {
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
					res(result.data)
				}
				/* 请求错误 */
				else
				{
					globalFun.gToastError(result.data.msg)
					rej(result.data)
				}
				/* 判断是否有新token,有则替换旧的token */
				if(result.header.Authorization)
				{
					uni.setStorageSync("token",result.header.Authorization)
				}
			},
			fail(err) 
			{
				console.log("请求错误")
				globalFun.gToastError("请求错误")
				rej(err)
			},
			complete()
			{
				uni.hideLoading()
			}
		})
	})
}
export default myRequest