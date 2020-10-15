<template>
	<view class="competition-list">
		<view 
			class="item"
			v-for="(item,index) in competition"
			:key="index">
			<!-- 左侧小图 -->
			<view class="left">
				<image :src="item.imgUrl" mode="widthFix"></image>
			</view>
			<!-- 中间文字介绍 -->
			<view class="content">
				<view class="name">{{item.title}}</view>
				<view class="brief small">{{item.brief}}</view>
				<view class="demand small">
					需求: {{item.demand}}
				</view>
			</view>
			<!-- 收藏按键 -->
			<text 
				class="collect iconfont icon-collection"
				@click="collect">
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				competition: [
					{
						imgUrl: "http://blogs.jinlongyuchitang.cn/background.jpg",
						title: "运河杯",
						brief: "大概达到噶搭嘎大立科技该等级哦搭嘎大哈哈sadgf啊大噶大厦的嘎的打好尬的散发大萨嘎的阿萨德尴尬ad好尬啊按时噶搭嘎啊",
						demand: "市场分析",
					},
					{
						imgUrl: "http://blogs.jinlongyuchitang.cn/background.jpg",
						title: "挑战杯",
						brief: "654854sdftgadagadgsagi",
						demand: "c++，java",
					},
					{
						imgUrl: "http://blogs.jinlongyuchitang.cn/background.jpg",
						title: "互联网+....",
						brief: "65485d4agf8541adgdi",
						demand: "市场分析",
					},
				]
			}
		},
		methods: {
			collect(){
				console.log("收藏")
			}
		}
	}
</script>

<style lang="stylus" scoped>
.competition-list
	.item
		position relative
		margin-bottom 10px
		height 200rpx
		line-height 1.3
		padding 5rpx 15rpx
		background-color var(--origin2)
		border-radius 15px
		display flex
		align-items center
		// 首个元素无上圆角
		&:first-child
			border-top-left-radius 0
			border-top-right-radius 0
		/* 左侧小图 */
		.left
			width 170rpx
			height 170rpx
			background-color var(--origin3)
			border-radius 10px
			overflow hidden
			display flex
			align-items center
			justify-content center
			image
				width 100%
				height 100%
		// 主体文字
		.content
			margin 0 30rpx 0 20rpx
			height 100%
			flex 1
			font-weight 600
			color var(--origin4)
			display flex
			flex-direction column
			justify-content space-between
			// 简介
			.brief
				height 100rpx
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
		// 收藏图标
		.collect
			position absolute
			right 0
			bottom -10rpx
			font-size 30px
			color var(--origin4)
			&.collected
				color var(--origin5)
</style>
