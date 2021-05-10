<template>
	<view class="tracks">
		<view
			class="track"
			v-for="(track,index) in tracks"
			:key="index">
			<!-- 辅助点 -->
			<view class="dot"></view>
			<!-- 时间 -->
			<view class="time">{{track.date}}</view>
			<!-- 项目名 -->
			<view class="track-name">{{track.trackName}}</view>
			<!-- 描述 -->
			<view class="result">{{track.result}}</view>
		</view>
	</view>
</template>

<script>
export default {
	name:"TimeTracks",
	props: {
		tracks: {
			type: Array,
			default: () => []
		}
	}
}
</script>

<style lang="stylus" scoped>
.tracks
	max-height 220px
	overflow auto
	padding 26px 15px 0 15px
	// 隐藏滚动条
	&::-webkit-scrollbar
		display: none
	.track
		height 42px
		font-size 22rpx
		display flex
		align-items flex-start
		.time
			margin 0 5px
			flex 0 0 46px
			font-size 20rpx
			color var(--gray1)
		.dot
			flex-shrink 0
			position relative
			width 10px
			height 10px
			border-radius 50%
			background-color var(--origin2)
			filter brightness(110%)
			&::after
				content ''
				position absolute
				left 50%
				top 16px
				transform translateX(-50%)
				border-left 1px dashed var(--gray2)
				height 20px
		.track-name
			flex 0 0 50%
			color var(--origin2)
			font-weight 700
		.result
			padding-right 5px
			flex 0 0 auto
			white-space nowrap
		// 第一个track的上方加虚线
		&:first-of-type .dot::before
			content ''
			position absolute
			left 50%
			top -25px
			transform translateX(-50%)
			border-left 1px dashed var(--gray2)
			height 20px
</style>
