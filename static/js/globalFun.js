import Vue from 'vue'
/* 
	name: showSuccess
	description: 无图标提示
*/
Vue.prototype.gToastMsg = (title,mask=false,duration=1500) => {
	uni.showToast({
		title,
		mask,
		duration,
		icon: "none"
	})
}
Vue.prototype.gToastSuccess = (title,mask=false,duration=1500) => {
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
*/
Vue.prototype.gToastError = (title,mask=false,duration=1500) => {
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
	return: 
				fileUrl: String,文件路径
	time: 2020/12/30
*/
var COS = require('./COS.js')
Vue.prototype.gUploadFile = (filePath,signature) => {
	return new Promise((resolve,reject) => {
		const cos = new COS({
			getAuthorization: function (options, callback) {
				callback({
					Authorization: signature.authorization
				})
			}
		})
		/* 转化成二进制 */
		wx.getFileSystemManager().readFile({
			filePath,
			success: (res) => {
				cos.putObject({
					Bucket: signature.bucketName,
					Region: signature.region,
					Key: signature.filename,
					Body: res.data,
				}, (err,data) => {
					if(err){
						reject(err)
					}
					else{
						resolve("https://" + data.Location)
					}
				})
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

/* 
	获取文件
	@params signature: Object,签名
*/
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
	name: putUserInfo
	description: 修改用户信息
	input: userInfo里的任意字段
	return: 
					userInfo: Object,新的userInfo
*/
Vue.prototype.gPutUserInfo = (data) => {
	for(let key in data){
		getApp().globalData.gUserInfo.userInfo[key] = data[key]
	}
	console.log(getApp().globalData.gUserInfo);
	return getApp().globalData.gUserInfo
}

/* 
	name: formatDate
	desc: 格式化日期成yy/mm/dd HH:mm
	input: Date
	return: String
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
		`${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	if(year === nyear){
		return `${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	return `${year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
}

/* 展示/隐藏等待 */
Vue.prototype.gLoading  = (that,type,delay=0) => {
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
				reject(err)
			}
		})
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
