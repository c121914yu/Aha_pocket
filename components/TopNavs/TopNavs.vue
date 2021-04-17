<template>
	<view 
		class="top-nav"
		:class="padding ? 'padding' : ''">
		<view 
			class="nav"
			:class="index === currentNav ? 'active' : ''"
			:style="{
				'background-color': backgroundColor
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
	name:"TopNavs",
	props: {
		navs: {
			type: Array,
			default: () => []
		},
		padding: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: "var(--origin1)"
		},
		backgroundColor: {
			type: String,
			default: "var(--origin4)"
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
			this.$emit("navChange",nav.value)
		}
	}
}
</script>

<style lang="stylus" scoped>
.top-nav
	width 100%
	background-color #FFFFFF
	border-bottom-left-radius 22px
	border-bottom-right-radius 22px
	display flex
	.nav
		flex 1
		padding 10px 0
		text-align center
		&:first-of-type
			border-bottom-left-radius 22px
		&:last-of-type
			border-bottom-right-radius 22px
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
	padding 5px 2px
	.nav
		margin 0 2px
</style>
