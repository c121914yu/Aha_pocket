<script>
export default {
	/* 
		 全局变量
	   getApp().globalData 获取
	 */
	globalData:{
		baseUrl: "http://47.93.224.217:8089",
		ossHost: "https://aha-public.oss-cn-hangzhou.aliyuncs.com/", // OSS Host域名
		gCodeTime: 0, // 用户允许发送验证码的倒计时
		gCodeMaxTime: 10, // 倒计时时长
		gUserInfo: {}, // 用户信息
		Schools: ["浙江工业大学","杭州电子科技大学","浙江大学","杭州师范大学"], // 学校列表
		Degress: ["博士后","博士","硕士","本科","专科","高中","初中"], // 学历列表
		Grads: ["前1%","1%-5%","5%-20%","20%-50%","50%-100%"], // 成绩等级
		TagsList: ["前端","挑战杯","互联网+","运河杯","数据集"],
		Matches: [], // 所有比赛
		prizeGrades: [
      {label: "国一",value:11},
      {label: "国二",value:12},
      {label: "国三",value:13},
      {label: "省一",value:21},
      {label: "省二",value:22},
      {label: "省三",value:23},
      {label: "校一",value:31},
      {label: "校二",value:32},
      {label: "校三",value:33},
      {label: "参与奖",value:41},
    ]
	}
}
</script>

<style lang="stylus">
@import './static/css/common.css'
</style>
