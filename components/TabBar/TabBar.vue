<template>
	<!-- 自定义底部导航栏 -->
	<view class="tabBar">
		<view 
			class="nav"
			:class="nav.name === navs[currentNav].name ? 'active' : ''"
			v-for="(nav,index) in navs"
			:key="index"
			@click="$emit('navigate',nav.name)">
			<text :class="'iconfont ' + nav.icon"></text>
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
					{icon: "icon-canjiaxiaowaijingsai",text: "竞赛",name: "Home"},
					{icon: "icon-shenghuofuwu",text: "生活服务",name: "Life"},
					{icon: "icon-huiyuan1",text: "会员",name: "Member"},
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
	height 140rpx
	width 100%
	background-color var(--origin4)
	display flex
	align-items center
	justify-content space-around
	text-align center
	.nav
		z-index 2
		flex 1
		color #FFFFFF
		line-height 1.2
		.iconfont
			font-size 46rpx
		.text
			font-size 30rpx
	.slide-card
		z-index 1
		position absolute
		width 25vw
		height 90%
		background-color var(--origin2)
		opacity 0.5
		border-radius 10px
		transition .3s
</style>
