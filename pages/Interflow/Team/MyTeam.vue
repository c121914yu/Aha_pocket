<template>
	<view v-if="env!==2" class="my-team">
		<view style="margin: auto;width: 95%;">
			<team-head></team-head>
		</view>
		<view class="teams">
			<team-card
				v-for="(team,index) in teams"
				:key="team"
				:team="team"
				:isShowContact="false"
				@click="clickTeam(team)">
			</team-card>
		</view>
		<BottomBtn linkTo="./CreateTeam">创建团队</BottomBtn>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getTeams } from "@/static/request/api_team.js"
import TeamCard from "./components/TeamCard.vue"
import TeamHead from "./components/TeamsHead.vue"
export default {
	data() {
		return {
			env: getApp().globalData.env,
			teams: []
		};
	},
	components: {
		"team-card": TeamCard,
		"team-head": TeamHead
	},
	onLoad() {
		if(this.env === 2){
			uni.showToast({
				title: "该模块正在开发!",
				icon: "none"
			})
		}
	},
	onShow() {
		this.loadTeams()
	},
	methods: {
		loadTeams()
		{
			this.gLoading(this,true)
			getTeams()
			.then(res => {
				this.teams = res.data
				console.log(res.data);
				this.gLoading(this,false)
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		},
		clickTeam(team)
		{
			console.log(team.id);
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
	padding 10px 0 60px
	background-color var(--white1)
	.teams
		width 90%
		margin 10px auto
</style>
