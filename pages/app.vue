<template>
	<view class="app">
		<!-- 加载动画 -->
		<Loading></Loading>
		<!-- 用户须知 -->
		<UserAgreement 
			v-if="!signedNotice"
			@readed="successSign">
		</UserAgreement>
		<!-- 系统公告 -->
		<SystemNotice 
			v-if="arr_systemNotice.length>0" 
			:notices="arr_systemNotice"
			@close="arr_systemNotice=[]">
		</SystemNotice>
		<!-- 导航 -->
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
			v-if="navs[currentNav].loaded"
			ref="Self">
		</Self>
	</view>
</template>

<script>
import { getAllCompetition } from "@/static/request/api_competition.js"
import { getNotice } from "@/static/request/api_system.js"
import ProjectHome from "./Project/ProjectHome.vue"
import Competition from "./Competition/Competition"
import Epiboly from "./Epiboly/Epiboly"
import Self from "./Self/Self"
export default {
	data() {
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
			currentNav: 3,
			signedNotice: getApp().globalData.gUserInfo.signedNotice,
			arr_systemNotice: []
		}
	},
	watch:{
		currentNav: (newNav) => {
			let text = ""
			switch(newNav){
				case 0: text="项目分享";break;
				case 1: text="竞赛信息";break;
				case 2: text="服务外包";break;
				case 3: text="个人信息";break;
			}
			uni.setNavigationBarTitle({
				title: text
			})
			if(newNav === 1 || newNav === 2){
				uni.showToast({
					title: "该模块正在开发!",
					icon: "none"
				})
			}
		}
	},
	components:{
		ProjectHome,
		Competition,
		Epiboly,
		Self,
	},
	onLoad() {
		/* 获取系统公告 */
		getNotice()
		.then(res => {
			res.data.forEach(item => {
				item.createTime = this.gformatDate(item.createTime,true)
				this.arr_systemNotice.push(item)
			})
		})
		this.loadCompetitionInfo()
		this.loadNav()
		/* 隐藏返回主页 */
		wx.hideHomeButton()
	},
	onReachBottom(){
		if(this.currentNav === 0){
			this.$refs.projectHome.loadMore()
		}
	},
	onShareAppMessage(e){
		return {
			title: "Aha口袋",
			path: "pages/Login/Login",
			desc: "加入Aha口袋",
		}
	},
	methods: {
		/* 完成协议签署 */
		successSign()
		{
			this.signedNotice = true
			this.loadCompetitionInfo()
			this.$refs.projectHome.loadProjects(true)
		},
		/* 加载比赛信息 */
		loadCompetitionInfo()
		{
			if(this.signedNotice){
                getAllCompetition()
                .then(res => {
                    getApp().globalData.Competitions = res.data
					// console.log(getApp().globalData.Competitions);
                })
            }
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
		loadNav()
		{
			this.navs[this.currentNav].loaded = true
		},
		/*
			name: 路由跳转
			description: 跳转指定下标的路由
			input: this.currentNav: Number,需要跳转的路由下标
			change: null
			return: null
		*/
		navigate(name)
		{
			const index = this.navs.findIndex(item => item.name === name)
			if(index !== this.currentNav){
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 0 
				})
			}
			else if(index === 0 && index === this.currentNav){
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 0 
				})
				this.$refs.projectHome.loadProjects(true)
			}
			this.currentNav = index
			this.loadNav()
		},
	}
}
</script>

<style lang="stylus" scoped>

</style>
