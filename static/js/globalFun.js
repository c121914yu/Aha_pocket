/* 
	gToastMsg - 无图标文字提示
	gToastSuccess - 成功提示
	gToastError - 错误提示
	gShowModal - 确认提示
	gUploadFile - 上传文件
	gGetFileUrl - 获取文件路径
	gGetMeInfo - 获取个人信息
	gformatDate - 格式化日期输出
	gLoading - 显示/隐藏加载动画
	gMenuPicker - 调用菜单选择框
	gClipboardData - 复制到剪切板
	gChooseImage - 选择图片
	gReadImage - 预览图片
	gIsNull - 判断输入是否为空
	gBackPage - 页面后退并提示文字
*/
import Vue from 'vue'

/**
 * 普通文本提示，无图标
 * @param {String}  title 内容
 * @param {Boolean}  mask 是否展示蒙层
 * @param {Number}  duration
 */
Vue.prototype.gToastMsg = (title,mask=false,duration=1500) => {
	uni.showToast({
		title,
		mask,
		duration,
		icon: "none"
	})
}

/**
 * 成功文本提示，打钩图标
 * @param {String}  title 内容
 * @param {Boolean}  mask 是否展示蒙层
 * @param {Number}  duration
 */
Vue.prototype.gToastSuccess = (title,mask=false,duration=1500) => {
	uni.showToast({
		title,
		mask,
		duration
	})
}

/**
 * 展示错误提示，错误图标
 * @param {String}  title 内容
 * @param {Boolean}  mask 是否展示蒙层
 * @param {Number}  duration
 */
Vue.prototype.gToastError = (title,mask=false,duration=1500) => {
	uni.showToast({
		title,
		image: "/static/icon/close.png",
		mask,
		duration
	})
}

/**
 * 提示确认操作
 * @param {String}  content 提示文字
 * @param {Function}  success 确认后操作
 * @param {Function}  cancel 取消后操作
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

/**
 * 上传文件
 * @param {String}  filePath
 * @param {Object}  signature 签名
 * @param {Function}  上传期间回调函数，用于监听进度，参数为上传进度
 * @return {Object} 上传完成回调，可以从header获取到上传地址
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

/**
 * 获取文件路径
 * @param {Object}  signature 签名
 * @return {String} 文件路径
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

/**
 * 获取最新个人信息，并更新全局变量
 * @return {Object} 个人信息
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

/**
 * 格式化日期输出，默认简写模式（当天仅显示时间，当年不显示年份)
 * @param {Date}  time 时间
 * @param {Boolean}  noAddr true-年月日时的格式，false-简写
 * @return {String} 时间字符串
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

/**
 * 获取当前年月日
 * @param {String}  symbol分隔符,用于分割年月日
 * @return {String}
 */
Vue.prototype.gGetToday = (symbol="-") => {
	const date = new Date()
	return `${date.getFullYear()}${symbol}${date.getMonth()+1}${symbol}${date.getDate()}`
}

/**
 * 展示/隐藏等待动画
 * @param {Object}  that 当前页面的this
 * @param {Boolean}  type 展示/隐藏
 * @param {Number}  delay 延迟显示时间
 */
Vue.prototype.gLoading  = (that,type,delay=0) => {
	/* 获取DOM */
	const dom = that.$refs.loading
	if(dom){
		// dom.show = type
		/* 关闭状态，延迟关闭 */
		if(!type) {
			setTimeout(() => {
				dom.show = false
			},100)
		}
		else {
			dom.show = true
		}
	}
}

/**
 * 调用menu弹窗进行单选,将选择的结果返回
 * @param {Array}  list 可以为一维简单数组，也可以为对象数组，对象必须包含label
 * @return {any}  选中的元素
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

/**
 * 复制到剪切板，并提示文字
 * @param {String}  content 复制内容
 * @param {String}  msg 提示文字
 */
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

/**
 * 选择图片
 * @param {Number}  count 图片数量
 * @param {Boolean}  original 是否可选原图
 * @return {String} 图片地址
 */
Vue.prototype.gChooseImage = (count=1,original=false) => {
	return new Promise((resolve,reject) => {
		uni.chooseImage({
			count, //默认9
			sizeType: original ? ["original","compressed"] :  ["compressed"]
		})
		.then(img => {
			resolve(img[1].tempFilePaths)
		})
		.catch(err => reject(err))
	})
}

/**
 * 预览图片
 * @param {Array}  urls 图片列表
 * @param {Number}  current 开始下标
 */
Vue.prototype.gReadImage = (urls,current=0) => {
	uni.previewImage({
		current,
		urls
	})
}

/**
 * 判断数据是否为空
 * @param {Array}  list 数组对象，必须包含val和errMsg值，检测val为空时提示errMsg
 * @return {Boolean}
 * author yjl
 */
Vue.prototype.gIsNull = (list) => {
	for(let i=0;i<list.length;i++){
		if(!list[i].val){
			Vue.prototype.gToastMsg(list[i].errMsg)
			return true
		}
	}
	return false
}

/**
 * 页面后退并提示文字
 * @param {Number}  page 后退多少页
 * @param {String} msg  提升文字 
 * author yjl
 */
Vue.prototype.gBackPage = (msg,page=1) => {
	uni.navigateBack({
		delta: page,
		complete: () => {
			if(msg){
				setTimeout(() => {
					Vue.prototype.gToastMsg(msg)
				})
			}
		}
	})
}

/**
 * 未设计界面提示
 */
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