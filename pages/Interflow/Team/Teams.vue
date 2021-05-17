<!-- 
	竞赛组队信息
	author yjl
-->
<template>
	<view class="teams" @touchmove="ontouchMove">
		<!-- 筛选框 -->
		<view class="filter">
			<team-filter @canSlide="is_canSlide=$event"></team-filter>
		</view>
		<view class="list">
			<team-card
				v-for="team in arr_teams"
				:key="team.id"
				:team="team"
				@click="onclickTeam(team)">
			</team-card>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getTeams } from "@/static/request/api_team.js"
import TeamCard from "./components/TeamCard.vue"
import TeamFilter from "./components/TeamFilter.vue"
export default {
	components: {
		"team-card": TeamCard,
		"team-filter": TeamFilter
	},
	data() {
		return {
			is_canSlide: true,
			pageSize: 10,
			pageNum: 1,
			is_loadAll: false,
			arr_teams: []
		}
	},
	created() {
		this.loadTeams(true,true)
	},
	methods: {
		/**
		 * 滑动事件
		 */
		ontouchMove(e)
		{
			/* 阻止滑动 */
			if(!this.is_canSlide) {
				e.preventDefault()
			}
		},
		/**
		 * 加载竞赛团队数据，默认会筛选招募中的队伍
		 * @param {Boolean}  init 是否初始化
		 * @param {Boolean}  loading 加载动画
		 */
		loadTeams(init=false,loading=false)
		{
			if(this.is_loadAll) {
				return
			}
			this.gLoading(this,loading)
			if(init){
				this.pageNum = 1
			}
			getTeams({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				recruit: 1
			})
			.then(res => {
				if(init) {
					this.arr_teams = []
				}
				this.arr_teams = this.arr_teams.concat(res.data)
				/* 判断是否加载全部 */
				if(res.data.length < this.pageSize) {
					this.is_loadAll = true
				}
				else {
					this.pageNum++
				}
				console.log(this.arr_teams[0]);
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 点击团队卡片，跳转详细
		 * @param {Object} team
		 */
		onclickTeam(team)
		{
			/* 该页是组件页，实际地址在app.vue，用绝对路径跳转比较保险 */
			uni.navigateTo({
				url: `/pages/Interflow/Team/TeamDetail?id=${team.id}`
			})
		},
	}
}
</script>

<style lang="stylus" scoped>
.teams
	min-height 80vh
	padding-top 40px
	.filter
		z-index 50
		position fixed
		top 50px
		width 100%
	.list
		z-index 10
		margin 10px 2%
		padding 10px
		border-radius 12px
		background-color var(--origin4)
</style>
