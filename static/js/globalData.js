export default  {
	baseUrl: 'https://ahapocket.cn/api',
	ossHost: 'https://aha-public.oss-cn-hangzhou.aliyuncs.com/', // OSS Host域名
	gCodeTime: 0, // 用户允许发送验证码的倒计时
	gCodeMaxTime: 10, // 倒计时时长
	gUserInfo: {}, // 用户信息
	gEditContent: "", // 编辑内容
	Schools: ['浙江工业大学', '杭州电子科技大学', '浙江大学', '杭州师范大学'], // 学校列表
	Degress: ['博士后', '博士', '硕士', '本科', '专科', '高中', '初中'], // 学历列表
	Grads: ['前1%', '1%-5%', '5%-20%', '20%-50%', '50%-100%'], // 成绩等级
	Competitions: [], // 所有比赛
	prizeLevels: [
		{ label: '国一', value: 53 },
		{ label: '国二', value: 52 },
		{ label: '国三', value: 51 },
		{ label: '省一', value: 43 },
		{ label: '省二', value: 42 },
		{ label: '省三', value: 41 },
		{ label: '市一', value: 33 },
		{ label: '市二', value: 32 },
		{ label: '市三', value: 31 },
		{ label: '校一', value: 23 },
		{ label: '校二', value: 22 },
		{ label: '校三', value: 21 },
		// { label: '参与奖', value: 11 }
	],
	compType: [
		{label: "经济类",value: 1},
		{label: "管理类",value: 2},
		{label: "法学类",value: 3},
		{label: "公管类",value: 4},
		{label: "语言类",value: 5},
		{label: "艺术传媒类",value: 6},
		{label: "学科类",value: 7},
		{label: "计算机类",value: 8},
		{label: "机械类",value: 9},
		{label: "建筑类",value: 10},
		{label: "化工类",value: 11},
		{label: "科研创业类",value: 12},
	],
	feedbackTypes: [
		{label: "平台BUG",value: 0},
		{label: "平台体验修改建议",value: 1},
		{label: "劣质项目",value: 2},
		{label: "订单缺失/购买错误",value: 3},
	],
	arr_fileTypes: [
		{label: "图片",value: 0,reg: /\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/i}, //图片
		{label: "视频/音频",value: 1,reg: /\.(avi|wmv|mpg|mpeg|mov|rm|ram|swf|raw|flv|mp4|mp3|wma|avi|rmvb|mkv)$/i}, //视频,音频
		{label: "文档",value: 2,reg: /\.(txt|doc|docx|ppt|pptx|csv|xls|xlsx)$/i}, //文档
		{label: "其他",value: 3,reg: /./}, //其他
	]
}