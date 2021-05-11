<!-- 
	竞赛交流
	author yjl
-->
<template>
	<view class="forum-home">
		<TopNavs 
			:navs="arr_navs"
			padding
			@navChange="currentNav=$event.value">
		</TopNavs>
		<talents 
			v-if="currentNav===0"
			ref="Talents">
		</talents>
		<teams v-if="currentNav===1">
		</teams>
	</view>
</template>

<script>
import Teams from "./Team/Teams.vue"
import Talents from "./Talents.vue"
export default {
	components: {
		"talents": Talents,
		"teams": Teams,
	},
	data() {
		return {
			env: getApp().globalData.env,
			arr_navs: [ // 顶部导航
				{label: "人才市场",value: 0},
				{label: "竞赛组队",value: 1},
				{label: "竞赛论坛",value: 2},
			],
			currentNav: 0
		}
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
