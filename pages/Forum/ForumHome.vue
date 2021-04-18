<template>
	<view class="forum-home">
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
			navs: [ // 顶部导航
				{label: "人才市场",amount: 0,value: 0},
				{label: "竞赛组队",amount: 0,value: 1},
				{label: "项目交流",amount: 0,value: 2},
			],
			currentNav: 0
		};
	},
	components: {
		Teams,
		Talents
	}
}
</script>

<style lang="stylus" scoped>
.forum-home
	min-height 100vh
	background-color var(--white1)
</style>
