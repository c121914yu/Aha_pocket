<!-- 
	我的团队
	author yjl
 -->
<template>
	<view v-if="env!==2" class="my-team">
		<view class="search">
			<search-input 
				textBgColor="var(--origin2)" 
				border="1px solid var(--origin2)"
				placeholder="搜索我的团队"
				v-model="search">
			</search-input>
		</view>
		<view class="filter">
			<view 
				class="item"
				:class="filter.value === activeFilter ? 'active' : ''"
				v-for="filter in arr_filter"
				:key="filter.value"
				@click="activeFilter=filter.value">
				{{filter.label}}
			</view>
		</view>
		<view class="teams">
			<team-card
				v-for="(team,index) in teams"
				:key="team"
				:team="team"
				:isShowContact="false"
				@click="onclickTeam(team)">
			</team-card>
		</view>
		<btn-bottom linkTo="./CreateTeam">创建团队</btn-bottom>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getTeams } from "@/static/request/api_team.js"
import TeamCard from "./components/TeamCard.vue"
export default {
	components: {
		"team-card": TeamCard,
	},
	data() {
		return {
			arr_filter: [
				{label: "全部",value: "all"},
				{label: "招募中",value: "recruited"},
				{label: "我创建",value: "created"},
				{label: "我管理",value: "admin"}
			],
			activeFilter: "all",
			teams: []
		}
	},
	onLoad() {
		this.loadTeams()
	},
	onPullDownRefresh() {
		this.loadTeams()
	},
	methods: {
		/**
		 * 加载团队信息
		 */
		loadTeams()
		{
			this.gLoading(this,true)
			getTeams()
			.then(res => {
				this.teams = res.data
				console.log(res.data)
			})
			.finally(() => {
				this.gLoading(this, false)
				uni.stopPullDownRefresh()
			})
		},
		/**
		 * 点击团队卡片
		 * @param {Object} team
		 */
		onclickTeam(team)
		{
			this.gMenuPicker(["查看团队","修改团队信息"])
			.then(res => {
				if(res === "查看团队"){
					uni.navigateTo({
						url: `./TeamDetail?id=${team.id}`
					})
				}
				else if(res === "修改团队信息"){
					uni.navigateTo({
						url: `./EditTeam?id=${team.id}`
					})
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.my-team
	min-height 100vh
	padding-bottom 60px
	background-color var(--white1)
	.search
		padding 5px 15px
		background-color #FFFFFF
	.filter
		background-color #FFFFFF
		display flex
		align-items center
		justify-content space-around
		.item
			padding 8px 0
			white-space nowrap
			border-bottom 3px solid transparent
			font-size 24rpx
			font-weight 600
			&.active
				border-bottom-color var(--origin2)
				color var(--origin2)
	.teams
		width 90%
		margin 10px auto
</style>
