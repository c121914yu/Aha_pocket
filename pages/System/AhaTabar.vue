<!-- 
	自定义底部导航栏
	author yjl
-->
<template>
	<view class="tabBar">
		<view 
			class="bar"
			:class="nav.name === navs[currentNav].name ? 'active' : ''"
			v-for="(nav,index) in navs"
			:key="index"
			@click="$emit('navigate',nav.name)">
			<text v-if="index !== 3 && currentNav === index" class="iconfont icon-shuaxin"></text>
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
	props:{
		currentNav: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			navs: [
				{icon: "icon-xiangmu",text: "项目分享",name: "ProjectHome"},
				{icon: "icon-canjiaxiaowaijingsai",text: "竞赛交流",name: "Interflow"},
				{icon: "icon-waibao",text: "技能实践",name: "Practice"},
				{icon: "icon-user",text: "我的Aha",name: "Self"},
			]
		}
	},
	created() {
		uni.$once("navChange",(index) => {
			this.watchNav(index)
		})
	},
	methods: {
		watchNav(i)
		{
			console.log(i);
			this.$emit('navigate',this.navs[i].name)
			uni.$once("navChange",(index) => {
				this.watchNav(index)
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.tabBar
	padding-bottom constant(safe-area-inset-bottom)
	padding-bottom env(safe-area-inset-bottom)
	z-index 10
	position fixed
	bottom 0
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
		height 63px
		background-color var(--origin1)
		border-radius 10px
		transition .3s
</style>
