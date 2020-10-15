/* 
	name: showSuccess
	description: 展示成功提示
	input: 
				title: String,提示文字
				mask: Boolean,是否展示蒙层
	return: null
*/
function gToastSuccess(title,duration=1500,mask=false){
	uni.showToast({
		title,
		mask,
		duration
	})
}
/* 
	name: showError
	description: 展示错误提示
	input: 
				title: String,提示文字
				mask: Boolean,是否展示蒙层
	return: null
*/
function gToastError(title,duration=1500,mask=false){
	uni.showToast({
		title,
		image: "/static/icon/close.png",
		mask,
		duration
	})
}

const globalFun = {
	gToastSuccess,
	gToastError,
}
export default globalFun