<template>
	<view class="menu-picker" @click="pick">
		<view class="label">{{label}}</view>
		<view
			class="value"
			:class="value ? '' : 'input-placeholder'">
			<text>{{value ? value : placeholder}}</text>
			<text class="iconfont icon-xiala"></text>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		value: String | Number,
		arr_range: {
			type: Array,
			default: () => []
		},
		label: {
			type: String,
			default: ""
		},
		placeholder: {
			type: String,
			default: ""
		},
	},
	methods: {
		pick()
		{
			uni.showActionSheet({
				itemList: this.arr_range,
				success: (res) => {
					this.$emit("input",this.arr_range[res.tapIndex])
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.menu-picker
	position relative
	padding 10px 0
	.label
		font-size 26rpx
	.value
		font-size 32rpx
		font-weight 700
		padding 0
		color var(--black)
		&.input-placeholder
			color var(--gray2)
	.iconfont
		position absolute
		right 0
		top 50%
		transform translateY(-50%)
		color var(--gray2)
</style>
