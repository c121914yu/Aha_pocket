<!-- 
	竞赛组队信息
	author yjl
-->
<template>
	<view class="teams" @touchmove.prevent>
		<!-- 筛选框 -->
		<view class="filter">
			<team-filter></team-filter>
		</view>
		<!-- 搜索 & 创建队伍 -->
		<view class="search">
			<search-input 
				style="flex: 1;"
				:radius="8"
				placeholder="搜索团队" 
				v-model="searchText">
			</search-input>
			<navigator hover-class="none" url="/pages/Interflow/Team/CreateTeam">
				<text class="iconfont icon-add-fill"></text>
			</navigator>
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
			pageSize: 10,
			pageNum: 1,
			is_loadAll: false,
			arr_teams: [],
			searchText: ""
		}
	},
	created() {
		this.loadTeams(true)
	},
	methods: {
		/**
		 * 加载竞赛团队数据，默认会筛选招募中的队伍
		 * @param {Boolean}  init 是否初始化
		 * @param {Boolean}  loading 加载动画
		 */
		loadTeams(init=false)
		{
			if(init){
				this.pageNum = 1
				this.is_loadAll = false
				this.gLoading(this,true)
			}
			if(this.is_loadAll) {
				return
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
	.search
		margin 10px 0
		padding 0 10px
		display flex
		align-items center
		.iconfont
			margin-left 5px
			font-size 45rpx
			color var(--origin2)
	.list
		z-index 10
		margin 10px 2%
		padding 10px
		border-radius 12px
		background-color var(--origin4)
</style>
