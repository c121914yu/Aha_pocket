<template>
	<view class="order-info">
		<image :src="user.avatarUrl"></image>
		<view class="item title">
			{{title}}
		</view>
		<view class="item point">
			{{pointMsg}}
		</view>
		<view class="card">
			<view class="item">
				<text class="label">付款方式</text>
				<text class="val">{{way}}</text>
			</view>
			<view class="item">
				<text class="label">账单分类</text>
				<text class="val">{{type}}</text>
			</view>
			<view class="item">
				<text class="label">创建时间</text>
				<text class="val">{{time}}</text>
			</view>
			<view class="item">
				<text class="label">账单号</text>
				<text class="val">{{number}}</text>
			</view>
		</view>
		<view class="feedback">
			对订单有疑问？点击反馈
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: 0,
			title: "项目通过-发放贡献度",
			type: "项目资源购买",
			way: "贡献点",
			point: 50, 
			time: "2020/12/4 20:05",
			number: "6521652165421451415",
			user: {
				avatarUrl: "https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png"
			}
		}
	},
	computed: {
		pointMsg()
		{
			const point = this.point > 0 ? `+${this.point.toFixed(2)}` : this.point.toFixed(2)
			return point
		}
	},
	onLoad(e) {
		console.log(e.id);
	},
	methods: {
		/* 获取订单信息 */
		getOrderInfo(id)
		{
			
		}
	}
}
</script>

<style lang="stylus" scoped>
.order-info
	min-height 100vh
	background-color var(--white1)
	padding 5% 10px
	display flex
	flex-direction column
	align-items center
	image
		width 60px
		height 60px
		border-radius 50%
	.item
		margin 5px 0
	.point
		font-size 50rpx
		font-weight 700
	.card
		margin-top 10px
		width 100%
		background-color #FFFFFF
		border-radius 8px
		.item
			padding 10px
			display flex
			justify-content space-between
			align-items center
			.label
				color var(--gray1)
			.val
				font-size 26rpx
				color var(--origin1)
	.feedback
		margin-top 10px
		font-size 26rpx
		color var(--origin1)
</style>
