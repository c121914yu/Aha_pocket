<!-- 组队信息 -->
<template>
	<view class="teams">
		<view class="header">
			<view style="margin-right: 20px;" class="item">我的队伍</view>
			<view class="item">发起组队</view>
		</view>
		<view class="list">
			<TeamCard
				v-for="team in teams"
				:key="team.name"
				:team="team">
			</TeamCard>
		</view>
	</view>
</template>

<script>
import TeamCard from "./Team/TeamCard.vue"
export default {
	data() {
		return {
			teams: [
				{name: "僵尸企业画像",time: "2020.9.9 11:14:19",memberNeed: 5,intro: "撒大声地",avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png"},
				{name: "僵尸企业画像1",time: "2020.9.9 11:14:19",memberNeed: 5,intro: "撒大声地",avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png"},
				{name: "僵尸企业画像2",time: "2020.9.9 11:14:19",memberNeed: 5,intro: "撒大声地",avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png"},
			]
		}
	},
	components: {
		TeamCard
	}
}
</script>

<style lang="stylus" scoped>
.teams
	padding 0 5% 80px 5%
	.header
		margin 10px 0
		display flex
		.item
			width 50%
			padding 8px
			background-color var(--origin3)
			color #FFFFFF
			text-align center
			border-radius 30px
			font-weight 600
			box-shadow 2px 3px 0 var(--origin1)
	.list
		padding 10px
		border-radius 12px
		background-color var(--origin4)
</style>
