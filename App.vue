<script>
import globalData from './static/js/globalData.js'
export default {
	/* 全局变量,getApp().globalData 获取*/
	globalData: globalData,
	onLaunch() {
		/* 检测是否有新版本 */
		let updateManager = uni.getUpdateManager()
		updateManager.onCheckForUpdate(res => {
			// 监听向微信后台请求检查更新结果事件
			console.log('是否有新版本：' + res.hasUpdate)
			if (res.hasUpdate) {
				//如果有新版本
				updateManager.onUpdateReady(() => {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，单击确定重启小程序',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启小程序
								updateManager.applyUpdate()
							}
						}
					})
				})
				// 小程序有新版本，会主动触发下载操作（无需开发者触发）
				updateManager.onUpdateFailed(() => {
					uni.showModal({
						title: '提示',
						content: '检查到有新版本，但下载失败，请稍后尝试',
						showCancel: false
					})
				})
			}
		})

		/* 判断是开发版还是线上版,开发版使用test接口 */
		const { miniProgram } = wx.getAccountInfoSync()
		switch (miniProgram.envVersion) {
			case 'develop':
				globalData.env = 0
				globalData.baseUrl = 'https://ahapocket.cn/aha_test'
				break
			case 'trial':
				globalData.env = 1
				globalData.baseUrl = 'https://ahapocket.cn/aha_test'
				break
			case 'release':
				globalData.env = 2
				break
		}
		// globalData.env = 2
		/* 下载比赛等级图 */
		const prizeLevels = uni.getStorageSync('prizeLevels')
		if (prizeLevels) {
			globalData.prizeLevels = JSON.parse(prizeLevels)
			console.log('已缓存比赛等级图')
		} 
		else {
			uni.showLoading({
				title: "下载依赖中...",
				mask: true
			})
			this.downloadFile(globalData.garr_prizeLevels.map(item => item.src))
			.then(res => {
				res.forEach((url,i) => {
					globalData.garr_prizeLevels[i].src = url
				})
				uni.setStorage({
					key: 'prizeLevels',
					data: JSON.stringify(globalData.garr_prizeLevels),
					success: () => {
						console.log('下载比赛等级图片完成')
					}
				})
			})
			.finally(() => uni.hideLoading())
		}

		/* 下载用户等级缓存图 */
		const userLevels = uni.getStorageSync('userLevels')
		if (userLevels) {
			globalData.garr_userLevel = JSON.parse(userLevels)
			console.log('已缓存用户等级图')
		} 
		else {
			this.downloadFile(globalData.garr_userLevel.map(item => item.src))
			.then(res => {
				res.forEach((url,i) => {
					globalData.garr_userLevel[i].src = url
				})
				uni.setStorage({
					key: 'userLevels',
					data: JSON.stringify(globalData.garr_userLevel),
					success: () => {
						console.log('下载用户等级图片完成')
					}
				})
			})
		}
	},
	methods: {
		/**
		 * 下载文件
		 * @param {Array} urls 文件地址
		 * @return {Promise}  带有最终地址的promise回调
		 */
		downloadFile(urls) 
		{
			const downP = (url) => new Promise((resolve,reject) => {
				uni.downloadFile({
					url: url,
					success: (res) => {
						if (res.statusCode === 200) {
							resolve(res.tempFilePath)
						}
						else {
							reject(res)
						}
					},
					fail: (err) => {
						console.error(err);
						reject(err)
					}
				})
			})
			const saveP = (url) => new Promise((resolve,reject) => {
				uni.saveFile({
					tempFilePath: url,
					success: (res) => {
						resolve(res.savedFilePath)
						
					},
					fail: (err) => {
						console.error(err);
						reject(err)
					}
				})
			})
			/* 下载图片 */
			let p = Promise.all(urls.map(url => downP(url)))
			/* 保存图片 */
			p = p.then(downImgs => Promise.all(downImgs.map(url => saveP(url))))
			return p
		}
	}
}
</script>

<style lang="stylus">
@import './static/css/common.css'
</style>
