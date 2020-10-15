<template>
	<view class="app">
		<TabBar 
			:name="navs[currentNav].name"
			@navigate="navigate">
		</TabBar>
		<!-- 主页 -->
		<Home 
			v-show="currentNav === 0"
			v-if="navs[currentNav].loaded">
		</Home>
		<!-- 生活 -->
		<Life
			v-show="currentNav === 1"
			v-if="navs[currentNav].loaded">
		</Life>
		<!-- 会员 -->
		<Member
			v-show="currentNav === 2"
			v-if="navs[currentNav].loaded">
		</Member>
		<!-- 个人 -->
		<Self
			v-show="currentNav === 3"
			v-if="navs[currentNav].loaded">
		</Self>
	</view>
</template>

<script>
import Home from "./Home/Home"
import Life from "./Life/Life"
import Member from "./Member/Member"
import Self from "./Self/Self"
export default {
	data() {
		return {
			/* 
				第一次不直接加载界面，防止加载时间过长
				切换到未缓存的界面时再进行加载
			*/
			navs: [
				{name: "Home",loaded: false},
				{name: "Life",loaded: false},
				{name: "Member",loaded: false},
				{name: "Self",loaded: false},
			],
			currentNav: 3
		}
	},
	methods: {
		showNav(){
			this.navs[this.currentNav].loaded = true
		},
		navigate(name){
			this.currentNav = this.navs.findIndex(item => item.name === name)
			this.showNav()
		}
	},
	onLoad() {
		this.showNav()
	},
	components:{
		Home,
		Life,
		Member,
		Self
	}
}
</script>

<style lang="stylus" scoped>

</style>
