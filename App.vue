<script>
import globalData from './static/js/globalData.js';
export default {
	/* 全局变量,getApp().globalData 获取*/
	globalData: globalData,
	onLaunch() {
		// 检测是否有新版本
		 let updateManager = uni.getUpdateManager()
		 updateManager.onCheckForUpdate((res) => {
			// 监听向微信后台请求检查更新结果事件
			console.log('是否有新版本：' + res.hasUpdate);
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
								updateManager.applyUpdate();
							}
						}
					});
				});
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
	}
};
</script>

<style lang="stylus">
@import './static/css/common.css'
</style>
