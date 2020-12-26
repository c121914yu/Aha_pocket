<!-- 评论打分 -->
<template>
	<view class="stars">
		<view 
			class="star"
			v-for="star in 5"
			@click="$emit('input',star+1)">
			<text 
				class="iconfont icon-start"
				:class="star < value ? 'active' : ''">
			</text>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		value: {
			type: Number,
			default: 0
		}
	}
}
</script>

<style lang="stylus" scoped>
.stars
	display flex
	align-items center
	.star
		margin 0 8px
		.iconfont
			color var(--gray2)
			font-size 32rpx
			&.active
				color var(--origin2)
</style>
