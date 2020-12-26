<template>
	<view v-if="show" class="loading">
		<view class="load">
			<text class="iconfont icon-start loader-star"></text>
			<view class="loader-circles"></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false
		}
	}
}
</script>

<style lang="stylus" scoped>
.loading
	z-index 100
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(8, 9, 21, 0.6)
	display flex
	align-items center
	justify-content center
	.load
		position relative
		width 100px
		height 100px
		.loader-star
			position absolute
			left 30px
			top 30px
			width 40px
			height 40px
			color #18FFFF
			animation loader-2-star 1s ease alternate infinite
			display flex
			align-items center
			justify-content center
		.loader-circles
			width 8px
			height 8px
			background #18ffff
			border-radius 50%
			position absolute
			left calc(50% - 4px)
			top calc(50% - 4px)
			transition all 1s ease
			animation loader-2-circles 1s ease-in-out alternate infinite
@keyframes loader-2-star
	0%
		transform rotate(0deg)
	100%
		transform rotate(360deg)
@keyframes loader-2-circles
	0%
		box-shadow 0 0 0 #18ffff
		opacity 1
		transform rotate(0deg)
	50%
		box-shadow 24px -22px #18ffff, 30px -15px 0 -3px #18ffff, 31px 0px #18ffff, 29px 9px 0 -3px #18ffff, 24px 23px #18ffff, 17px 30px 0 -3px #18ffff, 0px 33px #18ffff, -10px 28px 0 -3px #18ffff, -24px 22px #18ffff, -29px 14px 0 -3px #18ffff, -31px -3px #18ffff, -30px -11px 0 -3px #18ffff, -20px -25px #18ffff, -12px -30px 0 -3px #18ffff, 5px -29px #18ffff, 13px -25px 0 -3px #18ffff
		transform rotate(180deg)
	100%
		opacity 0
		transform rotate(360deg)
		box-shadow 25px -22px #18ffff, 15px -22px 0 -3px black, 31px 2px #18ffff, 21px 2px 0 -3px black, 23px 25px #18ffff, 13px 25px 0 -3px black, 0px 33px #18ffff, -10px 33px 0 -3px black, -26px 24px #18ffff, -19px 17px 0 -3px black, -32px 0px #18ffff, -23px 0px 0 -3px black, -25px -23px #18ffff, -16px -23px 0 -3px black, 0px -31px #18ffff, -2px -23px 0 -3px black
</style>
