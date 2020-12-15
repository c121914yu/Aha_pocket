<template>
	<view class="epiboly-card" @click="$emit('click')">
		<view class="title strong">{{epiboly.title}}</view>
		<view class="description small">
			<text class="strong">内容描述: </text>{{epiboly.description}}
		</view>
		<view class="info">
			<view class="time">
				<text class="iconfont icon-shalou"></text>
				<text><text class="small">工时:</text>{{epiboly.workTime}}天</text>
			</view>
			<view class="money">
				<text class="iconfont icon-moneynew"></text>
				<text><text class="small">出价:</text>{{epiboly.workReward}}元</text>
			</view>
			<view class="place">
				<text class="iconfont icon-didian"></text>
				<text><text class="small">地点:</text>{{epiboly.place}}</text>
			</view>
		</view>
		<view class="more" v-if="epiboly.showmore">
			<!-- 发起人 -->
			<view>
				<text class="label">发起人：</text>
				<text>{{epiboly.title}}</text>
			</view>
			<!-- 接单人 -->
			<view>
				<text class="label">接单人：</text>
				<text>一样一</text>
			</view>
			<!-- 已付金额 -->
			<view>
				<text class="label">已付金额：</text>
				<text class="strong">500元</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		epiboly: Object
	},
	data() {
		return {
			
		}
	}
}
</script>

<style lang="stylus" scoped>
.epiboly-card
	background-color #FFFFFF
	border-radius 8px
	display block
	overflow hidden
	word-break break-all
	.title,.description
		padding 10px
	.strong
		color var(--origin1)
	.title
		background-color var(--origin3)
	.info
		padding 0 10px
		display flex
		flex-wrap wrap
		view
			margin-right 10px
			display flex
			align-items center
			.small
				margin-right 3px
			.iconfont
				font-size 32rpx
		.time
			color var(--origin1)
		.money
			color #e86452
	.more
		padding 5px 10px
		.label
			color var(--origin1)
		.strong
			color #e86452
</style>
