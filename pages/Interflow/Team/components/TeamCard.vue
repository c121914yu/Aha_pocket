<!-- 团队卡片 -->
<template>
	<view class="team-card" @click="$emit('click')">
		<!-- header部分左右布局 -->
		<view class="header">
			<!-- 左侧头像 -->
			<Avatar :src="team.avatar || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'" size="60"></Avatar>
			<!-- 如果是竞赛招募队友，要显示参与什么竞赛 -->
			<view v-if="recruitState>0" class="recruit">
				招募中
			</view>
			<!-- 右侧两行 -->
			<view class="right">
				<!-- 队伍名 -->
				<view class="name">{{team.name}}</view>
				<!-- 成员情况 -->
				<view class="members">
					<view class="label mini">队长</view>
					<view class="val">{{captain}}</view>
					<view style="margin-left: 15px;" class="label mini">团队人数</view>
					<view class="val">{{team.members.length}}</view>
				</view>
				<!-- 学校 -->
				<view class="school">
					{{team.school}}
				</view>
			</view>
		</view>
		<!-- contaniner左右分布 -->
		<view class="container">
			<!-- 简要介绍 -->
			<view class="intro small" v-html="teamIntro"></view>
			<!--咨询按键 -->
			<button v-if="isShowContact" class="contact">咨询</button>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		team: {
			type: Object,
			default: () => {}
		},
		isShowContact: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			
		};
	},
	computed: {
		captain() {
			return this.team.members.find(member => this.team.captainId).memberRoughInfo.nickname
		},
		teamIntro() {
			console.log(this.team.recruitState);
			if(this.team.recruitState > 0){
				return this.team.recruitContent || "无团队介绍"
			}
			return this.team.intro || "无团队介绍"
		},
		tags(){
			if(this.team.tag){
				return this.team.tag.split(" ")
			}
			return []
		}
	},
	filters: {
		filterCaptain(id) {
			// console.log(that.team.members);
			// console.log(id);
			return 1
		}
	}
}
</script>

<style lang="stylus" scoped>
.team-card
	margin-bottom 10px
	padding 10px
	border-radius 8px
	background-color #FFFFFF
	overflow hidden
	.header
		position relative
		display flex
		.recruit
			position absolute
			right 0
			top 0
			font-weight 700
			color var(--origin1)
			animation shake .5s ease-in-out	 infinite alternate
		.right
			position relative
			margin-left 10px
			flex 1
			display flex
			flex-direction column
			align-items flex-start
			.time
				position absolute
				right 0
				top 0
				font-size 18rpx
				color var(--gray2)
				white-space pre-wrap
			/* 队伍名 */
			.name
				padding 0 10px
				border-radius 4px
				font-weight 700
				background-color var(--origin4)
			/* 成员情况 */
			.members
				margin 5px 0
				font-size 24rpx
				display flex
				align-items center
				.label
					margin-right 2px
					padding 0 10px
					border-radius 4px
					background-color var(--origin2)
					color #FFFFFF
				.val
					color var(--origin2)
			.school
				padding 0 10px
				border-radius 4px
				font-size 22rpx
				background-color var(--origin2)
				color #FFFFFF
	.container
		display flex
		align-items flex-end
		.intro
			height 78px
			flex 1
			padding 5px
			background-color var(--origin4)
			border-radius 8px
			overflow hidden
		.contact
			margin-left 15px
			width 50px
			line-height 1.2
			font-size 22rpx
			background-color var(--origin1)
			border-radius 22px
</style>
