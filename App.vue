<script>
export default {
	/* 
		 全局变量
	   getApp().globalData 获取
	 */
	globalData:{
		gCodeTime: 0, // 用户允许发送验证码的倒计时
		gCodeMaxTime: 10, // 倒计时时长
		gUserInfo: {}
	},
	onLaunch: function() {
	},
	onShow: function() {
	},
	onHide: function() {
	}
};
</script>

<style lang="stylus">
@import './static/css/common.css'
</style>
