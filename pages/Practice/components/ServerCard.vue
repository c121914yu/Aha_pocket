<template>
	<navigator 
		hover-class="none"
		class="server-card" 
		url="/pages/Epiboly/ServerDetail">
		<Avatar :src="server.avatar" size="60"></Avatar>
		<view class="right">
			<!-- 价格 -->
			<view class="price">￥{{server.price}}</view>
			<view class="name strong">{{server.name}}</view>
			<Tags :tags="server.tags"></Tags>
			<view class="time">
				{{server.time}}
			</view>
		</view>
		<view class="statistics">
			<view class="collect">
				<text class="iconfont icon-collection"></text>5
				<text class="iconfont icon-start"></text>10
			</view>
			<view class="sales">
				成交: 189
			</view>
		</view>
	</navigator>
</template>

<script>
export default {
	props: {
		server: Object
	},
	data() {
		return {
			
		}
	}
}
</script>

<style lang="stylus" scoped>
.server-card
	position relative
	margin-bottom 10px
	padding 10px 10px 10px 15px
	border-radius 12px
	background-color #FFFFFF
	display flex
	.right
		position relative
		margin-left 10px
		flex 1
		.price
			float right
			font-weight 700
			font-size 30rpx
			color var(--origin1)
		.name
			margin 0 50px 5px 0
			word-break break-all
			font-size 24rpx
		.time
			margin-top 10px
			font-size 20rpx
			color var(--gray2)
	.statistics
		position absolute
		right 15px
		bottom 0
		.collect
			font-size 20rpx
			color var(--origin1)
			display flex
			align-items center
			.iconfont
				margin-left 7px
				margin-right 2px
				font-size 20rpx
		.sales
			font-size 22rpx
			color var(--gray2)
			text-align end
</style>
