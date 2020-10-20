<script>
export default {
	/* 
		 全局变量
	   getApp().globalData 获取
	 */
	globalData:{
		gCodeTime: 0, // 用户允许发送验证码的倒计时
		gCodeMaxTime: 10, // 倒计时时长
		gUserInfo: {}, // 用户信息
		Degress: ["博士后","博士","硕士","本科","专科","高中","初中"], // 学历列表
		Grads: ["前1%","1%-5%","5%-20%","20%-50%","50%-100%"]
	}
}
</script>

<style lang="stylus">
@import './static/css/common.css'
</style>
