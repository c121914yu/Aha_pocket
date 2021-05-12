<!-- 组队信息 -->
<template>
	<view class="teams">
		<!-- 筛选框 -->
		
		<view class="list">
			<TeamCard
				v-for="team in teams"
				:key="team.id"
				:team="team"
				@click="onclickTeam(team)">
			</TeamCard>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import TeamCard from "./components/TeamCard.vue"
import { getTeams } from "@/static/request/api_team.js"
export default {
	components: {
		TeamCard
	},
	data() {
		return {
			pageSize: 15,
			pageNum: 1,
			teams: []
		}
	},
	created() {
		this.loadTeams(true)
	},
	methods: {
		loadTeams(init=false)
		{
			if(init){
				this.pageNum = 1
			}
			this.gLoading(this,true)
			getTeams()
			.then(res => {
				console.log(res.data);
				this.teams = this.teams.concat(res.data)
			})
			.finally(() => this.gLoading(this,false))
		},
		/* 点击团队卡片，跳转 */
		onclickTeam(team)
		{
			uni.navigateTo({
				url: `/pages/Interflow/Team/TeamDetail?id=${team.id}`
			})
		},
	}
}
</script>

<style lang="stylus" scoped>
.teams
	padding 0 2% 80px 2%
	.list
		padding 10px
		border-radius 12px
		background-color var(--origin4)
</style>
