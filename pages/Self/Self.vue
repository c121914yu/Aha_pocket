<template>
	<view class="self">
		<view class="head">
			<!-- 头像 -->
			<view class="avatar">
				<view class="bg bg1"></view>
				<view class="bg bg2"></view>
				<view class="bg bg3"></view>
				<image src="../../static/icon/logo.png" mode="widthFix"></image>
			</view>
			<!-- 右侧昵称 & 标签 -->
			<view class="right">
				<!-- 昵称 -->
				<view class="name">15677751219画像</view>
				<!-- 标签 -->
				<view class="tags">
					<view 
						class="tag small"
						v-for="(tag,index) in tags"
						:key="index">
						{{tag}}
					</view>
				</view>
			</view>
			<!-- 幕布 -->
			<view class="curtain">
				<view class="one"></view>
				<view class="two"></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: null,
			tags: ["前端","挑战杯","商业计划书","运河杯","服务外包"]
		}
	},
	methods: {
		
	},
	created() {
		
	}
}
</script>

<style lang="stylus" scoped>
bgSetting(size,color)
	width size
	height size
	background-color color
.self
	height 100vh
	background-color var(--origin2)
	.head
		position relative
		height 45vw
		background-color #FFFFFF
		/* 头像 */
		.avatar
			position absolute
			width 60vw
			height 60vw
			left 20vw
			top 20vw
			transform translate(-50%,-50%)
			display flex
			align-items center
			justify-content center
			image
				z-index 5
				width 30vw
				height 30vw
			.bg
				position absolute
				border-radius 50%
			.bg1
				z-index 4
				bgSetting(40vw,var(--origin2))
			.bg2
				z-index 3
				bgSetting(50vw,var(--origin3))
			.bg3
				z-index 2
				bgSetting(60vw,var(--origin4))
		/* 右侧 */
		.right
			margin-left 50vw
			width 50vw
			padding 10px
			.name
				color var(--origin4)
				font-weight 600
			.tags
				display flex
				flex-wrap wrap
				.tag
					margin 5px
					padding 3px 10px
					border-radius 10px
					background-color var(--origin3)
					color #FFFFFF
		/* 幕布 */
		.curtain
			z-index 6
			position absolute
			top 0
			width 100%
			height 70vw
			display flex
			view
				width 50%
			.one
				background-color var(--origin2)
				transform-origin right top
				animation curtaine1 .8s forwards
			.two
				background-color var(--origin2)
				transform-origin left top
				animation curtaine2 .8s forwards
				
/* 动画 */
@keyframes curtaine1
	to
		transform rotate(90deg)
@keyframes curtaine2
	to
		transform rotate(-90deg)
</style>
