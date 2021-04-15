<template>
	<!-- 自定义底部导航栏 -->
	<view class="tabBar">
		<view 
			class="bar"
			:class="nav.name === navs[currentNav].name ? 'active' : ''"
			v-for="(nav,index) in navs"
			:key="index"
			@click="$emit('navigate',nav.name)">
			<text v-if="currentNav===0 && index===0" class="iconfont icon-shuaxin"></text>
			<text v-else :class="'iconfont ' + nav.icon"></text>
			<view class="text">
				{{nav.text}}
			</view>
		</view>
		<!-- 颜色滑块 -->
		<view 
			class="slide-card"
			:style="{'left': `${25 * currentNav}vw`}">
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			navs: [
				{icon: "icon-xiangmu",text: "项目分享",name: "ProjectHome"},
				{icon: "icon-canjiaxiaowaijingsai",text: "社区论坛",name: "ForumHome"},
				{icon: "icon-waibao",text: "服务外包",name: "Epiboly"},
				{icon: "icon-user",text: "我的",name: "Self"},
			]
		}
	},
	props:{
		currentNav: {
			type: Number,
			default: 0
		}
	}
}
</script>

<style lang="stylus" scoped>
.tabBar
	z-index 10
	position fixed
	bottom 0
	height 70px
	width 100%
	background-color var(--origin2)
	display flex
	align-items center
	justify-content space-around
	.bar
		z-index 2
		height 70px
		flex 1
		color #FFFFFF
		line-height 1.2
		display flex
		flex-direction column
		justify-content center
		align-items center
		.iconfont
			font-size 40rpx
		.text
			font-weight 600
			font-size 24rpx
	.slide-card
		z-index 1
		position absolute
		width 25vw
		height 90%
		background-color var(--origin1)
		border-radius 10px
		transition .3s
</style>
