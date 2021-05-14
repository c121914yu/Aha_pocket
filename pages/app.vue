<!-- 
	自定义首页
	author: yjl
 -->
<template>
	<view class="app">
		<!-- 用户须知 -->
		<user-aggrement 
			v-if="!is_signedNotice"
			@readed="successSign">
		</user-aggrement>
		<!-- 系统公告 -->
		<system-notice ref="systemNotice"></system-notice>
		<!-- 底部导航 -->
		<aha-tabar 
			:currentNav="currentNav"
			@navigate="onclickTabBar">
		</aha-tabar>
		<!-- 项目主页 -->
		<project-hone 
			ref="projectHome"
			v-if="navs[0].loaded"
			v-show="currentNav === 0">
		</project-hone>
		<!-- 竞赛交流主页 -->
		<interflow-home
			ref="interflowHome"
			v-if="navs[1].loaded"
			v-show="currentNav === 1">
		</interflow-home>
		<!-- 实践主页 -->
		<practice-home
			v-if="navs[2].loaded"
			v-show="currentNav === 2">
		</practice-home>
		<!-- 个人 -->
		<self
			ref="Self"
			v-if="navs[3].loaded"
			v-show="currentNav === 3">
		</self>
	</view>
</template>

<script>
import { getAllCompetition } from "@/static/request/api_competition.js"
import { getUnreadCount } from '@/static/request/api_userInfo.js'
import AhaNotice from "./System/AhaNotice.vue"
import AhaTabar from "./System/AhaTabar.vue"
import UserAgreement from "./Self/Number/components/UserAgreement.vue"
import ProjectHome from "./Project/ProjectHome.vue"
import InterflowHome from "./Interflow/InterflowHome"
import PracticeHome from "./Practice/PracticeHome"
import Self from "./Self/Self"
export default {
	components:{
		"system-notice": AhaNotice, // 系统公告
		"aha-tabar": AhaTabar, // 自定义导航
		"user-aggrement": UserAgreement, // 用户协议弹窗
		"project-hone": ProjectHome, //项目主页
		"interflow-home": InterflowHome,// 竞赛交流主页
		"practice-home": PracticeHome, // 实践主页
		"self": Self, // 个人主页
	},
	data() {
		return {
			navs: [ // 利用loaded实现类似keep-alive效果
				{name: "ProjectHome",loaded: true},
				{name: "Interflow",loaded: false},
				{name: "Practice",loaded: false},
				{name: "Self",loaded: false},
			],
			currentNav: 0,
			is_signedNotice: getApp().globalData.gUserInfo.signedNotice, // 是否已经签署用户协议
		}
	},
	watch: {
		/**
		 * 路由切换，修改对应的头部文字
		 * @param {Number} newNav
		 */
		currentNav: function(newNav){
			let text = ""
			switch(newNav){
				case 0: text="项目分享";break;
				case 1: text="竞赛交流";break;
				case 2: text="技能实践";break;
				case 3: text="个人信息";break;
			}
			uni.setNavigationBarTitle({
				title: text
			})
		}
	},
	onLoad() {
		console.log(getApp().globalData.gUserInfo);
		/* 隐藏返回主页 */
		wx.hideHomeButton()
		if(this.is_signedNotice){
			this.loadNeed()
			this.judgeUnreadInforms()
		}
	},
	onShow() {
		/* 更新个人页未读 */
		if(this.$refs.Self){
			this.$refs.Self.getUnread()
		}
	},
	onReachBottom(){
		/* 加载更多项目 */
		if(this.currentNav === 0){
			this.$refs.projectHome.loadMore()
		}
		else if(this.currentNav === 1){
			switch(this.$refs.interflowHome.currentNav){
				/* 人才市场 */
				case 0: 
					this.$refs.interflowHome.$refs.Talents.reachBottom()
					break
				/* 组队 */
				case 1:
					this.$refs.interflowHome.$refs.Talents.reachBottom()
					break
			}
		}
	},
	onShareAppMessage(e){
		return {
			title: "Aha口袋",
			path: `pages/Login/Login?token=${uni.getStorageSync('token')}`,
			desc: `${getApp().globalData.gUserInfo.userInfo.nickname}邀您加入Aha口袋`
		}
	},
	methods: {
		/**
		 * 判断是否有未读，如果有未读，提示是否需要跳转消息通知
		 */
		judgeUnreadInforms()
		{
			getUnreadCount()
			.then(res => {
				if(res.data > 0) {
					this.gToastMsg(`您有${res.data}条未读通知!`,false,2000)
				}
			})
		},
		/**
		 * 点击tabbar，切换路由
		 * @param {String} name 路由名
		 */
		onclickTabBar(name)
		{
			const index = this.navs.findIndex(item => item.name === name)
			/* 如果不是点击当前路由，则回到顶部 */
			if(index !== this.currentNav){
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 0 
				})
			}
			/* 位于项目页，且点击当前路由，刷新项目 */
			else if(index === 0 && index === this.currentNav){
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 0 
				})
				this.$refs.projectHome.loadProjects(true)
			}
			this.currentNav = index
			this.navs[this.currentNav].loaded = true
		},
		/**
		 * 加载所有依赖
		 */
		loadNeed()
		{
			/* 加载系统公告 */
			this.$refs.systemNotice.loadNotice()
			/* 加载比赛信息 */
			getAllCompetition()
			.then(res => {
			    getApp().globalData.garr_competitions = res.data
				/* 加载项目列表 */
				this.$refs.projectHome.loadProjects(true)
			})
		},
		/**
		 * 完成协议签署,重新加载依赖
		 */
		successSign()
		{
			this.is_signedNotice = true
			this.loadNeed()
		}
	}
}
</script>

<style lang="stylus" scoped>

</style>
