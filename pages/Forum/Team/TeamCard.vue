<template>
	<navigator class="team-card" url="./TeamDetail">
		<!-- header部分左右布局 -->
		<view class="header">
			<!-- 左侧头像 -->
			<Avatar :src="team.avatar" size="60"></Avatar>
			<!-- 右侧两行 -->
			<view class="right">
				<!-- 时间 -->
				<view class="time center" v-html="team.time"></view>
				<!-- 队伍名 -->
				<view class="name">{{team.name}}</view>
				<!-- 如果是竞赛招募队友，要显示参与什么竞赛 -->
				<view class="competition">
					全国大学生服务外包大赛
				</view>
				<!-- 项目成员 -->
				<view class="members">
					<view class="label mini">项目成员</view>
					<view 
						class="member"
						v-for="item in 5"
						:key="item">
						<image :src="team.avatar"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- contaniner左右分布 -->
		<view class="container">
			<!-- 简要介绍 -->
			<view class="intro small">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores et?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti Lorem ipsum dolor sit amet, consectetur adipisicing elit. At consectetur.
			</view>
			<!-- 状态 -->
			<view class="mini status ing">
				进行中
			</view>
		</view>
	</navigator>
</template>

<script>
export default {
	props:{
		team: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			
		};
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
		display flex
		.right
			margin-left 10px
			position relative
			flex 1
			.time
				float right
				font-size 18rpx
				color var(--gray2)
				white-space pre-wrap
			.name
				font-weight 700
			.competition
				margin 5px 0
				padding 0 10px
				border-radius 22px
				font-size 22rpx
				background-color var(--origin3)
				display inline-block
			.members
				display flex
				align-items center
				.label
					margin-right 5px
					padding 0 10px
					border-radius 22px
					background-color var(--origin2)
					color #FFFFFF
					line-height 1.7
				.member
					margin-left 2px
					width 20px
					height 20px
					border-radius 50%
					border 1px solid var(--origin1)
					image
						width 100%
						height 100%
						border-radius 50%
	.container
		display flex
		align-items flex-end
		.intro
			height 78px
			flex 1
			padding 5px
			background-color var(--origin4)
			border-radius 8px
			display -webkit-box
			-webkit-box-orient vertical
			-webkit-line-clamp 4
			overflow hidden
		.status
		    // 让左侧溢出
			margin-left -30px
			padding 5px 20px 15px
			letter-spacing 1px
			transform rotate(-45deg) translate(30rpx,70rpx)
			&.ing
				background-color #67C23A
				color #FFFFFF
</style>
