<template>
	<view class="team-card">
		<!-- header部分左右布局 -->
		<view class="header">
			<!-- 左侧头像 -->
			<image class="avatar" :src="team.avatar"></image>
			<!-- 右侧两行 -->
			<view class="right">
				<!-- 队伍名 时间 -->
				<view class="title">
					<view class="name">{{team.name}}</view>
					<view class="time">{{team.time}}</view>
				</view>
				<!-- 项目成员 -->
				<view class="members">
					<view class="label mini">项目成员</view>
					<view 
						class="member"
						v-for="item in 5"
						:key="item">
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
	</view>
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
	margin-bottom 5px
	padding 10px
	border-radius 8px
	background-color #FFFFFF
	overflow hidden
	.header
		display flex
		.avatar
			width 50px
			height 50px
			border-radius 50%
			background-color var(--origin2)
		.right
			flex 1
			margin-left 5px
		.title
			display flex
			justify-content space-between
			.name
				padding 0 10px
				color #333333
				font-weight 600
				border-radius 22px
				background-color var(--origin4)
			.time
				font-size 18rpx
				color var(--gray2)
		.members
			margin 10px 0
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
				width 15px
				height 15px
				border-radius 50%
				border 1.5px solid var(--origin1)
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
