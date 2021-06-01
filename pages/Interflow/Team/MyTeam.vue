<!-- 
	我的团队
	author yjl
 -->
<template>
	<view v-if="env!==2" class="my-team">
		<view class="header">
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
		</view>
		<view class="teams">
			<team-card
				v-for="(team,index) in arr_teams"
				:key="team"
				:team="team"
				:isShowContact="false"
				@click="onclickTeam(team)">
			</team-card>
		</view>
		<view v-if="arr_teams.length > 0" class="center remark">已加载全部</view>
		<view v-else class="no-team">
			<view class="msg">还没有团队，要不试试</view>
			<view class="btns">
				<button class="btn" @click="findTeam">寻找团队</button>
				<navigator class="btn" hover-class="none" url="./CreateTeam"><button>创建团队</button></navigator>
			</view>
		</view>
		<btn-bottom linkTo="./CreateTeam">创建团队</btn-bottom>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getMyTeams } from "@/static/request/api_team.js"
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
			arr_teams: []
		}
	},
	onShow() {
		this.loadTeams()
	},
	methods: {
		/**
		 * 加载团队信息
		 */
		loadTeams()
		{
			this.gLoading(this,true)
			getMyTeams()
			.then(res => {
				this.arr_teams = res.data
			})
			.finally(() => {
				this.gLoading(this, false)
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
		},
		/**
		 * 查找团队，返回上一页，并切换底部路由至1
		 */
		findTeam()
		{
			uni.$emit("navChange",1)
			uni.navigateBack({
				delta: 1
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.my-team
	min-height 100vh
	padding-top 82px
	padding-bottom constant(safe-area-inset-bottom)
	padding-bottom env(safe-area-inset-bottom)
	background-color var(--white1)
	.header
		z-index 10
		position fixed
		top 0
		width 100%
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
	.no-team
		padding 20px
		text-align center
		.msg
			color var(--origin1)
		.btns
			margin-top 10px
			display flex
			justify-content space-around
			.btn
				margin 0
				width 35%
	.remark
		margin-bottom 60px
		font-size 22rpx
		color var(--gray2)
</style>
