<!-- 
	通用顶部导航
	author yjl
 -->
<template>
	<view 
		class="top-nav"
		:class="padding ? 'padding' : ''"
		:style="{
			'--radius': radius
		}">
		<view 
			class="nav"
			:class="index === currentNav ? 'active' : ''"
			:style="{
				'background-color': backgroundColor,
				'padding': small ? '5px 0' : '10px 0'
			}"
			v-for="(nav,index) in navs"
			:key="index"
			@click="navChange(nav,index)">
			<text 
				class="label"
				:style="{
					'color': color
				}">
				{{nav.label}}
			</text>
			<text v-if="nav.amount > 0" class="amount center">{{nav.amount | amountFilter}}</text>
		</view>
	</view>
</template>

<script>
export default {
	name:"top-navs",
	props: {
		navs: { // ｛label:  *｝
			type: Array,
			default: () => []
		},
		/* 是否显示边距 */
		padding: {
			type: Boolean,
			default: false
		},
		/* 扁平 */
		small: {
			type: Boolean,
			default: false
		},
		/* 文字颜色 */
		color: {
			type: String,
			default: "var(--origin1)"
		},
		/* 选框背景色，选中默认都是origin2 */
		backgroundColor: {
			type: String,
			default: "var(--origin4)"
		},
		/* 圆角 */
		radius: {
			type: String,
			default: "22px"
		}
	},
	data() {
		return {
			currentNav: 0
		};
	},
	filters: {
		amountFilter(val){
			if(val > 99){
				return 99 + "+"
			}
			return val
		}
	},
	methods: {
		/* 点击切换导航 */
		navChange(nav,index)
		{
			this.currentNav = index
			this.$emit("navChange",nav,index)
		}
	}
}
</script>

<style lang="stylus" scoped>
.top-nav
	width 100%
	background-color #FFFFFF
	border-bottom-left-radius var(--radius)
	border-bottom-right-radius var(--radius)
	display flex
	.nav
		flex 1
		text-align center
		&:first-of-type
			border-bottom-left-radius var(--radius)
		&:last-of-type
			border-bottom-right-radius var(--radius)
		.label
			letter-spacing 1px
			font-size 24rpx
		.amount
			margin-left 5px
			font-size 18rpx
			width 22px
			height 22px
			line-height 22px
			border-radius 50%
			background-color var(--origin2)
			color #FFFFFF
			display inline-block
			text-align center
		&.active
			background-color var(--origin2) !important
			.label
				color #FFFFFF !important
			.amount
				background-color var(--white2)
				color var(--origin2)
.padding
	padding 5px 4px
	.nav
		margin 0 4px
</style>
