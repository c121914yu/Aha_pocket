<template>
	<view class="select-interest">
		<!-- 蒙层 -->
		<view class="mask"></view>
		<!-- 主体内容 -->
		<view class="content">
			<!-- 标题 -->
			<view class="h3">根据需求为你定制推荐内容</view>
			<view class="arrow-right" @click="$emit('close')">
				<text class="iconfont icon-arrow-right icon"></text>
				<text class="text small">跳过</text>
			</view>
			<!-- 标签选择 -->
			<view class="select">
				<view class="title strong">个人</view>
				<view class="select-box">
					<view 
						class="item" 
						v-for="(tag,index) in selfTags" 
						:key="index"
						@click="selectTag(tag)">
						<text class="strong">{{tag.text}}</text>
						<view class="circle-out" >
							<view 
								class="in"
								:style="{
									'background-color': tag.select ? '#e60012' : '#f39800'
								}">
								</view>
						</view>
					</view>
				</view>
				<view class="title strong">竞赛</view>
				<view class="select-box">
					<view 
						class="item compete" 
						v-for="(tag,index) in competeTags" 
						:key="index"
						@click="selectTag(tag)">
						<view class="strong">{{tag.text}}</view>
						<view class="circle-out">
							<view
								class="in"
								:style="{
									'background-color': tag.select ? '#e60012' : '#f39800'
								}">
								</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部按键 -->
			<view class="bottom">
				<button @click="sure">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selfTags: [
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
				],
				competeTags: [
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
					{text: "标签",select: false},
				],
			}
		},
		methods: {
			selectTag(tag){
				tag.select=!tag.select
			},
			sure(){
				const interest = this.selfTags.concat(this.competeTags).filter(item => item.select)
				console.log(interest)
				this.$emit("close")
			}
		}
	}
</script>

<style lang="stylus" scoped>
.select-interest
	z-index 100
	position fixed
	top 0
	left 0
	height 100vh
	width 100vw
	animation show .6s ease
	@keyframes show
		0%
			transform translateY(100%)
		100%
			transform translateY(0)
	.mask
		position absolute
		top 0
		left 0
		width 100%
		height 100%
		background-color rgba(0,0,0,0.3)
	.content
		position relative
		z-index 999
		margin-top 10vh
		height 90vh
		width 100%
		background-image linear-gradient(#fffef7, #f7d7b9)
		border-top-left-radius 30px
		border-top-right-radius 30px
		::-webkit-scrollbar
			width 0
			height 0
			color transparent
		.h3
			margin-bottom 70rpx
			padding 20px
			color var(--font-dark)
		.arrow-right
			position absolute
			right 20px
			top 15px
			display flex
			flex-direction column
			align-items center
			.icon
				line-height 0.8
				font-size 100rpx
				color var(--button-bg)
				text-shadow var(--shadow2)
			.text
				color var(--origin-font)
		.select
			width 100%
			height 100%
			padding 0 40rpx 340rpx
			overflow-y scroll
			.title
				position relative
				margin-bottom 30rpx
				display flex
				align-items center
				justify-content center
				color #f39800
				&::before
					content ''
					position absolute
					margin-left -80px
					width 22%
					height 2px
					background-color var(--origin-font)
					border-radius 10px
				&::after
					content ''
					position absolute
					margin-left 80px
					width 22%
					height 2px
					background-color var(--origin-font)
					border-radius 10px
			.select-box
				margin-bottom 40rpx
				display grid
				grid-template-columns 1fr 1fr
				grid-gap 15px
				.item
					height 45px
					padding 0 10px 0 15px
					background-color #f8d99f
					border-radius 15px
					box-shadow var(--shadow2)
					display flex
					align-items center
					justify-content space-between
					&.compete
						height 80px
						padding 10px 10px 10px 15px
						align-items flex-start
						.strong
							height 100%
							display flex
							align-items flex-end
					.circle-out
						width 30px
						height 30px
						opacity 0.6
						border-radius 50%
						background-color var(--bg-color1)
						display flex
						align-items center
						justify-content center
						.in
							width 22px
							height 22px
							border 1px solid #999999
							border-radius 50%
		.bottom
			position absolute
			bottom 0
			padding 5px 0
			width 100%
			background-color #FFFFFF
			border-top-left-radius 40px
			border-top-right-radius 40px
			button
				margin 10px auto
				width 70%
				font-size 32rpx
				color #FFFFFF
				background-color var(--button-bg)
</style>
