<script>
export default {
	/* 
		 全局变量
	   getApp().globalData 获取
	 */
	globalData:{
		baseUrl: "http://47.100.33.161:8089",
		ossHost: "https://aha-public.oss-cn-hangzhou.aliyuncs.com/", // OSS Host域名
		gCodeTime: 0, // 用户允许发送验证码的倒计时
		gCodeMaxTime: 10, // 倒计时时长
		gUserInfo: {}, // 用户信息
		Schools: ["浙江工业大学","杭州电子科技大学","浙江大学","杭州师范大学"], // 学校列表
		Degress: ["博士后","博士","硕士","本科","专科","高中","初中"], // 学历列表
		Grads: ["前1%","1%-5%","5%-20%","20%-50%","50%-100%"], // 成绩等级
		AccessoriesClassify: ["商业计划书","PPT","论文","演示视频","个人心得","数据集"], // 文章分类
		TagsList: ["前端","挑战杯","互联网+","运河杯","数据集"],
		MatchName: ["挑战杯","运河杯","互联网+","服务外包"], // 比赛名称
		prizeGrades: ["国一","国二","国三","省一","省二","省三","校一","校二","校三","参与奖"],
	}
}
</script>

<style lang="stylus">
@import './static/css/common.css'
</style>
