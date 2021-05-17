<!-- 
	竞赛交流主页
	author yjl
-->
<template>
	<view class="forum-home">
		<view class="nav">
			<top-navs
				padding
				radius="0"
				:navs="arr_navs"
				@navChange="navChange">
			</top-navs>
		</view>
		<talents
			v-if="arr_navs[0].loaded"
			v-show="currentNav===0"
			ref="Talents">
		</talents>
		<teams 
			v-if="arr_navs[1].loaded"
			v-show="currentNav===1"
			ref="Teams">
		</teams>
		<Forums
			v-if="arr_navs[2].loaded"
			v-show="currentNav===2">
		</Forums>
	</view>
</template>

<script>
import Teams from "./Team/Teams.vue"
import Talents from "./Talents.vue"
import Forums from "./Forum/Forums.vue"
export default {
	components: {
		"talents": Talents,
		"teams": Teams,
		"forums": Forums
	},
	data() {
		return {
			env: getApp().globalData.env,
			arr_navs: [ // 顶部导航
				{label: "人才市场",value: 0,loaded: true},
				{label: "竞赛组队",value: 1,loaded: false},
				{label: "竞赛论坛",value: 2,loaded: false},
			],
			currentNav: 0
		}
	},
	methods: {
		/**
		 * 路由修改,修改对应路由的loaded状态使其加载
		 */
		navChange(e)
		{
			this.arr_navs[e.value].loaded = true
			this.currentNav = e.value
		}
	}
}
</script>

<style lang="stylus" scoped>
.forum-home
	min-height 100vh
	padding-top 50px
	margin-bottom 80px
	padding-bottom constant(safe-area-inset-bottom)
	padding-bottom env(safe-area-inset-bottom)
	background-color var(--white1)
	.nav
		z-index 100
		position fixed
		top 0
		left 0
		right 0
		height 50px
		border-bottom var(--border2)
		background-color #FFFFFF
</style>
