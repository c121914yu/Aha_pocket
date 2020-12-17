<!-- 我的钱包 -->
<template>
	<view class="wallet">
		<view class="head">
			<view class="balance">
				<view class="small">余额(元)</view>
				<view class="h3">{{myBalance}}</view>
				<view class="function">
					<view class="ctr">
						<text class="iconfont icon-tixian"></text>
						<text>提现</text>
					</view>
				</view>
			</view>
			<view class="points">
				<view class="small">贡献点(个)</view>
				<view class="h3">{{myPoint}}</view>
				<view class="function">
					<view class="ctr">
						<text class="iconfont icon-qian"></text>
						<text>充值</text>
					</view>
					<view class="ctr" @click="isShowGive=true">
						<text class="iconfont icon-zengsong"></text>
						<text>赠送</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 卡片操作 -->
		<navigator 
			class="card"
			v-for="(card,index) in cards"
			:key="index"
			:url="card.to">
			<text :class="'logo iconfont ' + card.icon"></text>
			<text class="name">{{card.name}}</text>
			<text class="explain">{{card.explain}}</text>
			<text class="right iconfont icon-arrow-right"></text>
		</navigator>
		<GivePoint
			v-if="isShowGive"
			@close="isShowGive=false"
			@success="upDate">
		</GivePoint>
	</view>
</template>

<script>
import GivePoint from "./PointsComponents/GivePoint.vue"
export default {
	data() {
		return {
			myBalance: 0,
			myPoint: 500,
			cards: [
				{name: "实名认证",icon: "icon-shimingrenzheng",to: "/pages/Self/Authentication",explain: "实名认证后才可提现"},
				{name: "贡献点账单",icon: "icon-icon",to: "/pages/Self/Orders?type=0",explain: ""},
				{name: "现金账单",icon: "icon-zhangdan",to: "/pages/Self/Orders?type=1",explain: ""},
			],
			isShowGive: false
		}
	},
	components: {
		GivePoint
	},
	methods: {
		/* 重新更新余额和贡献点 */
		upDate()
		{
			this.isShowGive = false
		}
	}
}
</script>

<style lang="stylus" scoped>
.wallet
	min-height 100vh
	background-color var(--white1)
	.head
		padding 20px 0
		text-align center
		display flex
		justify-content space-around
		.small
			color var(--gray2)
			font-size 22rpx
		.h3
			margin 5px 0
			font-size 50rpx
		.function
			display flex
			.ctr
				margin 0 5px
				font-size 24rpx
				background-color #FFFFFF
				padding 0 10px
				border-radius 22px
				.iconfont
					margin-right 5px
				.icon-tixian
					color var(--origin1)
				.icon-qian
					color var(--origin2)
				.icon-zengsong
					color #e86452
	/* 操作卡片 */
	.card
		margin 5px 2.5%
		padding 10px
		background-color #FFFFFF
		border-radius 8px
		display flex
		align-items center
		.name
			flex 1
			margin-left 10px
		.logo
			width 40px
			height 40px
			line-height 40px
			border-radius 50%
			text-align center
			font-size 40rpx
		.icon-shimingrenzheng
			color #5ad8a6
			background-color rgba(90,216,166,0.2)
		.icon-icon
			color #5b8ff9
			background-color rgba(91,143,249,0.2)
		.icon-zhangdan
			color #f8b86b
			background-color rgba(248,184,107,0.2)
		.explain
			font-size 24rpx
			color var(--gray2)
		.right
			margin-left 10px
			font-size 42rpx
			color var(--origin2)
</style>
