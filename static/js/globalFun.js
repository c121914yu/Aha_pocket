/* 
	gToastMsg - 无图标文字提示
	gToastSuccess - 成功提示
	gToastError - 错误提示
	gShowModal - 确认提示
	gUploadFile - 上传文件
	gGetFileUrl - 获取文件路径
	gGetMeInfo - 更新个人信息
	gformatDate - 格式化日期输出
	gLoading - 显示/隐藏加载动画
	gMenuPicker - 调用菜单选择框
	gClipboardData - 复制到剪切板
	gReadImage - 预览图片
*/
import Vue from 'vue'
/* 普通文本提示*/
Vue.prototype.gToastMsg = (title,mask=false,duration=1500) => {
	uni.showToast({
		title,
		mask,
		duration,
		icon: "none"
	})
}
/* 成功文本提示 */
Vue.prototype.gToastSuccess = (title,mask=false,duration=1500) => {
	uni.showToast({
		title,
		mask,
		duration
	})
}
/*  展示错误提示 */
Vue.prototype.gToastError = (title,mask=false,duration=1500) => {
	uni.showToast({
		title,
		image: "/static/icon/close.png",
		mask,
		duration
	})
}
/* 
	提示确认操作
	@params content: String,提示文字
	@params success: Function,点击确认后的操作
	@params cancel: Function,点击取消后的操作
*/
Vue.prototype.gShowModal = (content,success,cancel) => {
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

/* 
	name: uploadFile
	description: 上传文件至OSS存储空间
	@params filePath: String,待上传的临时路径
	@params signature: Object,签名
	@return: fileUrl: String,文件路径
	time: 2020/12/30
*/
Vue.prototype.gUploadFile = (filePath,signature,updateDom=null) => {
	return new Promise((resolve,reject) => {
		const uploadTask = uni.uploadFile({
			url: `https://${signature.bucketName}.cos.${signature.region}.myqcloud.com/`,
			name: 'file',
			filePath: filePath,
			formData: {
				"key": signature.filename,
				"policy": signature.policy,
				"q-sign-algorithm": "sha1",
				"q-ak": signature.secretId,
				"q-key-time": signature.keyTime,
				"q-signature": signature.signature
			},
			success: (res) => {
				if(res.statusCode === 204){
					resolve(res)
				}
				reject(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
		uploadTask.onProgressUpdate((res) => {
			if(updateDom){
				updateDom(res.progress)
			}
		})
	})
}

/* 
	获取文件路径
	@params signature: Object,签名
	@return filePath: String,文件路径
*/
var COS = require('./COS.js')
Vue.prototype.gGetFileUrl = (signature) => {
	return new Promise((resolve,reject) => {
		const cos = new COS({
			getAuthorization: function (options, callback) {
				callback({
					Authorization: signature.authorization
				})
			}
		})
		/* 获取数据 */
		cos.getObjectUrl({
			Bucket: signature.bucketName,
			Region: signature.region,
			Key: signature.filename,
			Sign: true,
			Expires: 60,
		}, (err, data) => {
			if (err){
				reject(err)
			}
			resolve(data.Url)
		})
	})
}

/* 
	更新个人信息，重新请求getMe
	@set getApp().globalData.gUserInfo: Object,全局个人信息变量
	@return gUserInfo: Object,个人信息变量
*/
import { getMe } from "@/static/request/api_userInfo.js"
Vue.prototype.gGetMeInfo = () => {
	return new Promise((resolve,reject) => {
		getMe()
		.then(res => {
			/* 统计数据不变 */
			const statistice = getApp().globalData.gUserInfo.statistice
			getApp().globalData.gUserInfo = {
				...res.data,
				statistice
			}
			resolve(res.data)
		})
		.catch(err => {
			console.error(err)
			reject(err)
		})
	})
	
}

/* 
	格式化日期输出，默认简写模式（当天仅显示时间，当年不显示年份)
	@params time: Date,日期
	@params noAddr: Boolean,是否简写
	@return: String,日期字符串
	time: 2021/1/3
*/
Vue.prototype.gformatDate = (time,noAddr=false) => {
	const date = new Date(time)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minutes = date.getMinutes()
	
	const nDay = new Date()
	const nyear = nDay.getFullYear()
	const nmonth = nDay.getMonth() + 1
	const nday = nDay.getDate()
	
	if(noAddr){
		return `${year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	if(year === nyear && month === nmonth && day === nday){
		return `${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	if(year === nyear){
		return `${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	return `${year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
}
/* 
	获取今天 
	@return yy-mm-dd
*/
Vue.prototype.gGetToday = (symbol="-") => {
	const date = new Date()
	return `${date.getFullYear()}${symbol}${date.getMonth()+1}${symbol}${date.getDate()}`
}

/* 展示/隐藏等待 */
Vue.prototype.gLoading  = (that,type,delay=0) => {
	/* 获取DOM */
	const dom = that.$refs.loading
	if(dom){
		setTimeout(() => {
			if(dom){
				dom.show = type
			}
		},delay)
	}
}

/* 
	调用menu弹窗进行单选,将选择的结果返回
	@params list: Array,选择列表，每个元素为一个对象，对象必须包含label属性,或者每个元素为字符串
	@return 选择的元素
	time: 2020/12/31
*/
Vue.prototype.gMenuPicker = (list) => {
	return new Promise((resolve,reject) => {
		uni.showActionSheet({
			itemList: typeof list[0] === "object" ? list.map(item => item.label) : list,
			success: (res) => {
				resolve(list[res.tapIndex])
			},
			fail: (err) => {
				if(err.errMsg === "showActionSheet:fail cancel"){
					resolve()
				}
				else{
					reject(err)
				}
			}
		})
	})
}

/* 复制到剪切板 */
Vue.prototype.gClipboardData = (content,msg) => {
	uni.setClipboardData({
		data: content,
		success: () => {
			Vue.prototype.gToastMsg(msg)
		},
		fail: (err) => {
			console.log(err);
			Vue.prototype.gToastMsg("复制错误..")
		}
	})
}

/* 未设计界面提示 */
Vue.prototype.gUndesign = (back=true) => {
	uni.showModal({
		title: "提示",
		content: "该模块正在设计,尽情期待!",
		confirmText: "期待",
		showCancel: false,
		success: () => {
			uni.navigateBack({
				delta: 1
			})
		}
	})
}

/* 预览图片 */
Vue.prototype.gReadImage = (urls,current=0) => {
	uni.previewImage({
		current,
		urls
	})
}