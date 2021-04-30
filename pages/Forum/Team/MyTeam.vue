<template>
	<view v-if="env!==2" class="my-team">
		<view class="sort">
			
		</view>
		<view class="teams">
			<team-card
				v-for="(team,index) in teams"
				:key="team"
				:team="team">
			</team-card>
		</view>
		<BottomBtn linkTo="./CreateTeam">创建团队</BottomBtn>
	</view>
</template>

<script>
import TeamCard from "./TeamCard.vue"
export default {
	data() {
		return {
			env: getApp().globalData.env,
			teams: [
				{name: "僵尸企业画像",time: "2020.9.9\n11:14:19",memberNeed: 5,intro: "撒大声地",avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png"},
				{name: "僵尸企业画像1",time: "2020.9.9\n11:14:19",memberNeed: 5,intro: "撒大声地",avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png"},
				{name: "僵尸企业画像2",time: "2020.9.9\n11:14:19",memberNeed: 5,intro: "撒大声地",avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png"},
			]
		};
	},
	components: {
		"team-card": TeamCard
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
.my-team
	min-height 100vh
	padding 10px 0 40px
	background-color var(--white1)
	.teams
		width 90%
		margin 10px auto
</style>
