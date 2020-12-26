import Vue from 'vue'
/* 
	name: showSuccess
	description: 展示成功提示
	input: 
				title: String,提示文字
				mask: Boolean,是否展示蒙层
*/
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
	input: 
				url: String,待上传的临时路径
				name: String,待上传文件的文件名
				signature: Object,签名
	return: 
				fileName: String,最终的文件名
*/
Vue.prototype.gUploadFile = (url,name,signature) => {
  const filename = `${signature.dir}/${name}`
  return new Promise((resolve,reject) => {
    uni.uploadFile({
      url: signature.host,
      filePath: url,
      name: "file",
      formData: {
        key: filename, // 文件名
        policy: signature.policy,
        OSSAccessKeyId: signature.accessid,
        signature: signature.signature
      },
      success: (res) => {
        if(res.statusCode === 204)
          resolve(getApp().globalData.ossHost + filename)
         else
          reject(err)
      },
      fail: (err) => {
        reject(err)
      }
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
	return {...getApp().globalData.gUserInfo}
}

/* 
	name: formatDate
	desc: 格式化日期成yy/mm/dd HH:mm
	input: Date
	return: String
*/
Vue.prototype.gformatDate = (time) => {
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
	if(year === nyear && month === nmonth && day === nday){
		`${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	if(year === nyear){
		return `${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
	}
	return `${year < 10 ? '0'+year : year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`
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
