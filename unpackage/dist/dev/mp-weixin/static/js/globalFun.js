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
/* 
	name: showModal
	description: 提示确认操作
	input: 
				content: String,提示文字
				success: Function,点击确认后的操作
				cancel: Function,点击取消后的操作
	return: null
*/
function gShowModal(content,success,cancel){
	uni.showModal({
		title: "提示",
		content,
		confirmColor: "#f8b86b",
		success: (res) => {
			if(res.confirm && success)
			{
				success()
			}
			else if(res.cancel && cancel)
			{
				cancel
			}
		}
	})
}

const globalFun = {
	gToastSuccess,
	gToastError,
	gShowModal
}
export default globalFun