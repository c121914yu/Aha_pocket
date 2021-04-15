<template>
	<view class="top-nav">
		<view 
			class="nav"
			:class="index === currentNav ? 'active' : ''"
			v-for="(nav,index) in navs"
			:key="index"
			@click="navChange(nav,index)">
			<text class="label">{{nav.label}}</text>
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
	padding 5px 0
	border-bottom-left-radius 22px
	border-bottom-right-radius 22px
	display flex
	.nav
		margin-left 5px
		flex 1
		padding 10px 0
		background-color var(--origin4)
		text-align center
		font-weight 600
		&:first-of-type
			border-bottom-left-radius 22px
		&:last-of-type
			border-bottom-right-radius 22px
			margin-right 5px
		.label
			font-size 24rpx
			color var(--origin1)
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
			background-color var(--origin2)
			.label
				color #FFFFFF
			.amount
				background-color var(--white2)
				color var(--origin2)
</style>
