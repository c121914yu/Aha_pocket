<template>
	<view v-if="env!==2" class="forum-home">
		<TopNavs 
			:navs="navs"
			padding
			@navChange="currentNav=$event.value">
		</TopNavs>
		<Talents ref="Talents"  v-if="currentNav===0"></Talents>
		<Teams v-if="currentNav===1"></Teams>
	</view>
</template>

<script>
import Teams from "./Teams.vue"
import Talents from "./Talents.vue"
export default {
	data() {
		return {
			env: getApp().globalData.env,
			navs: [ // 顶部导航
				{label: "人才市场",amount: 0,value: 0},
				{label: "竞赛组队",amount: 0,value: 1},
				{label: "竞赛交流",amount: 0,value: 2},
			],
			currentNav: 0
		};
	},
	components: {
		Teams,
		Talents
	},
	onLoad() {
		if(this.env === 2){
			uni.showToast({
				title: "该模块正在开发!",
				icon: "none"
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.forum-home
	min-height 100vh
	background-color var(--white1)
</style>
