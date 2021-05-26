export default  {
	baseUrl: 'https://ahapocket.cn/api',
	env: 0, // 版本表示，0开发，1体验，2上线
	startPath: "", // 初始路径，会在app.vue中调用
	gCodeTime: 0, // 用户允许发送验证码的倒计时
	gCodeMaxTime: 10, // 倒计时时长
	gUserInfo: {}, // 个人信息
	gEditContent: "", // MD编辑内容
	gobj_RichText: null, // 富文本内容
	garr_competitions: [], // 所有比赛
	garr_forumTags: [],
	garr_prizeLevels: [//获奖等级
		{ label: '保研国一', value: 53,max: 4000,min: 2000,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/43.png"},
		{ label: '保研国二', value: 52,max: 3000,min: 1500,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/42.png" },
		{ label: '保研国三', value: 51,max: 2000,min: 1000,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/41.png" },
		{ label: '国一', value: 43,max: 3500,min: 1750,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/43.png"},
		{ label: '国二', value: 42,max: 2500,min: 1250,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/42.png" },
		{ label: '国三', value: 41,max: 1500,min: 750,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/41.png" },
		{ label: '省一', value: 33,max: 2000,min: 1000,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/33.png" },
		{ label: '省二', value: 32,max: 1400,min: 700,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/32.png" },
		{ label: '省三', value: 31,max: 800,min: 400,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/31.png" },
		{ label: '市一', value: 23,max: 1200,min: 600,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/23.png" },
		{ label: '市二', value: 22,max: 600,min: 300,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/22.png" },
		{ label: '市三', value: 21,max: 400,min: 200,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/21.png" },
		{ label: '校一', value: 13,max: 300,min: 150,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/13.png" },
		{ label: '校二', value: 12,max: 200,min: 100,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/12.png" },
		{ label: '校三', value: 11,max: 100,min: 50,src: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/11.png" },
	],
	garr_compType: [ //比赛类型
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
	garr_feedbackTypes: [ //反馈类型
		{label: "平台BUG",value: 0},
		{label: "平台体验修改建议",value: 1},
		{label: "劣质项目",value: 2},
		{label: "订单缺失/购买错误",value: 3},
	],
	garr_fileClassify: [ //附件分类
		{label: "PPT",value: 1,rate: 1},
		{label: "文档",value: 2,rate: 3},
		{label: "论文",value: 3,rate: 1},
		{label: "成果展示",value: 4,rate: 1},
		{label: "竞赛心得",value: 5,rate: 0.5}
	],
	garr_fileTypes: [ //附件类型
		{label: "图片",value: 0,reg: /\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/i}, //图片
		{label: "视频/音频",value: 1,reg: /\.(avi|wmv|mpg|mpeg|mov|rm|ram|swf|raw|flv|mp4|mp3|wma|avi|rmvb|mkv)$/i}, //视频,音频
		{label: "文档/PPT",value: 2,reg: /\.(txt|doc|docx|ppt|pptx|csv|xls|xlsx|pdf)$/i}, //文档
		{label: "其他",value: 3,reg: /./}, //其他
	],
	garr_ordersType: [ //订单类型
		{label: "Aha币充值",type: 1,order: null},
		{label: "活动赠送",type: 2,order: null},
		{label: "注册赠送",type: 3,order: null},
		{label: "签到奖励",type: 4,order: null},
		{label: "附件购买",type: 5,order: null},
		{label: "项目购买返利",type: 6,order: null},
		{label: "邀请好友",type: 7,order: null},
		{label: "项目上传奖励",type: 8,order: null},
		{label: "Aha币提现",type: 9,order: null}
	],
	garr_userLevel: [ //用户等级类型
		{label:"Aha萌新",src:"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/userLevel/1.png",totalContribPoint: 3000},
		{label:"Aha进阶",src:"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/userLevel/2.png",totalContribPoint: 6000},
		{label:"Aha小佬",src:"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/userLevel/3.png",totalContribPoint: 10000},
		{label:"Aha大佬",src:"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/userLevel/4.png",totalContribPoint: 12000},
		{label:"Aha巨佬",src:"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/userLevel/5.png",totalContribPoint: 1000000000},
	]
}