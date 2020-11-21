<template>
	<view class="app">
		<!-- 用户须知 -->
		<UserAgreement 
			v-if="!signedNotice"
			@readed="successSign">
		</UserAgreement>
		<TabBar 
			:currentNav="currentNav"
			@navigate="navigate">
		</TabBar>
		<!-- 主页 -->
		<ProjectHome 
			ref="projectHome"
			v-show="currentNav === 0"
			v-if="navs[currentNav].loaded">
		</ProjectHome>
		<!-- 生活 -->
		<Competition
			v-show="currentNav === 1"
			v-if="navs[currentNav].loaded">
		</Competition>
		<!-- 会员 -->
		<Epiboly
			v-show="currentNav === 2"
			v-if="navs[currentNav].loaded">
		</Epiboly>
		<!-- 个人 -->
		<Self
			v-show="currentNav === 3"
			v-if="navs[currentNav].loaded">
		</Self>
	</view>
</template>

<script>
import { getAllCompetition } from "@/static/request/api_competition.js"
import ProjectHome from "./Project/ProjectHome.vue"
import Competition from "./Competition/Competition"
import Epiboly from "./Epiboly/Epiboly"
import Self from "./Self/Self"
export default {
	data() {
		const signedNotice = getApp().globalData.gUserInfo.signedNotice || false
		return {
			/* 
				第一次不直接加载界面，防止加载时间过长
				切换到未缓存的界面时再进行加载
			*/
			navs: [
				{name: "ProjectHome",loaded: false},
				{name: "Competition",loaded: false},
				{name: "Epiboly",loaded: false},
				{name: "Self",loaded: false},
			],
			currentNav: 0,
			signedNotice
		}
	},
	methods: {
		/* 完成协议签署 */
		successSign()
		{
			this.signedNotice = true
			this.loadCompetitionInfo()
			this.$refs.projectHome.initProjects()
		},
		/* 加载比赛信息 */
		loadCompetitionInfo()
		{
			if(this.signedNotice)
				getAllCompetition()
				.then(res => {
					getApp().globalData.Matches = res.data
				})
		},
		/* 
			name: 路由加载
			description: 加载指定下标的路由
			input:
						this.currentNav: Number,当前路由下标
			change:
						this.navs[].loaded: Boolean,路由是否加载标识符
			return: null
		*/
		loadNav(){
			this.navs[this.currentNav].loaded = true
		},
		/*
			name: 路由跳转
			description: 跳转指定下标的路由
			input:
						this.currentNav: Number,需要跳转的路由下标
			change: null
			return: null
		*/
		navigate(name){
			uni.pageScrollTo({ 　　　　　　
				duration: 0,
				scrollTop: 0 
			})
			this.currentNav = this.navs.findIndex(item => item.name === name)
			this.loadNav()
		}
	},
	onLoad() {
		console.log(getApp().globalData.gUserInfo)
		this.loadCompetitionInfo()
		this.loadNav()
	},
	/* 仅主页允许下拉刷新和触底加载 */
	onPullDownRefresh() {
		if(this.currentNav === 0)
			this.$refs.projectHome.initProjects()
		else
			uni.stopPullDownRefresh()
	},
	onReachBottom(){
		if(this.currentNav !== 0)
			return
		this.$refs.projectHome.loadMore()
	},
	components:{
		ProjectHome,
		Competition,
		Epiboly,
		Self,
	}
}
</script>

<style lang="stylus" scoped>

</style>
