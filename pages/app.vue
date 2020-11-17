<template>
	<view class="app">
		<!-- 用户须知 -->
		<UserAgreement 
			v-if="!signedNotice"
			@readed="signedNotice=true">
		</UserAgreement>
		<TabBar 
			:currentNav="currentNav"
			@navigate="navigate">
		</TabBar>
		<!-- 主页 -->
		<ProjectHome 
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
		const signedNotice = getApp().globalData.gUserInfo.signedNotice
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
			signedNotice
		}
	},
	methods: {
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
		getAllCompetition()
		.then(res => {
			getApp().globalData.Matches = res.data
		})
		this.loadNav()
		console.log(getApp().globalData.gUserInfo)
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
