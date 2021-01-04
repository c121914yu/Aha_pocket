<!-- 外包详情 -->
<template>
	<view class="epiboly">
		<view class="head">
			<navigator 
				class="left"
				hover-class="none"
				url="../Self/UserHome">
				<image :src="epiboly.issuer.avatarUrl"></image>
				<view>{{epiboly.issuer.name}}</view>
			</navigator>
			<view class="right">
				<view class="title">{{epiboly.title}}</view>
				<view class="item"><text class="origin">合作地点:</text>{{epiboly.place}}</view>
				<view class="item"><text class="origin">上限工时:</text>{{epiboly.workTime}}天</view>
				<view class="item"><text class="origin">最低出价:</text><text class="strong">{{epiboly.workReward}}元</text></view>
			</view>
		</view>
		<view class="description">
			<view class="h3">需求描述</view>
			<view>{{epiboly.description}}</view>
		</view>
		<view class="step">
			<view class="h3">外包进度</view>
			<Steps :steps="epiboly.steps" :actice="epiboly.activeStep"></Steps>
		</view>
		<!-- <view class="btn">
			<button>投递简历</button>
			<view class="small center">已有100人投递</view>
		</view> -->
	</view>
</template>

<script>
import Steps from "./components/Steps.vue"
export default {
	data() {
		return {
			epiboly: {
				title: "***小程序",
				workTime:10,
				workReward: 1000,
				place: "浙江工业大学",
				issuer: {
					avatarUrl: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
					name: "****公司"
				},
				description:"大的撒广撒点5广东省十多个ds16g415大嘎达6ds41g5ds4g5sd",
				steps: [
					{title: "待发起人选择接单人",desc: "已有50人投递简历。"},
					{title: "第一阶段",desc: "甲方已支付定金"},
					{title: "待发起人选择接单人",desc: "已有50人投递简历,赶紧上车吧！"},
				],
				activeStep: 0
			},
		}
	},
	components: {
		Steps
	},
	onLoad(e) {
		/* 根据ID获取外包信息 */
	}
}
</script>

<style lang="stylus" scoped>
.epiboly
	min-height 100vh
	background-color var(--white1)
	.head
		padding 10px
		background-color var(--white2)
		display flex
		.origin
			margin-right 5px
			color var(--origin2)
		.left
			padding 10px
			font-size 26rpx
			color var(--origin1)
			text-align center
			image
				width 60px
				height 60px
		.right
			flex 1
			padding 10px
			.title
				background-color var(--origin4)
				padding 5px
				font-size 32rpx
				border-radius 8px
			.item
				margin 5px 0
	.description,.step
		margin-top 15px
		background-color #FFFFFF
		padding 10px
		.h3
			padding 5px
			color var(--origin1)
			border-bottom var(--border1)
	.btn
		position absolute
		bottom 0
		left 0
		right 0
		background-color #FFFFFF
		padding 10px
		border-top-left-radius 22px
		border-top-right-radius 22px
		button
			border-radius 22px
		.small
			color var(--gray1)
</style>
