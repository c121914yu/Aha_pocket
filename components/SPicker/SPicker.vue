<template>
	<picker
		class="picker"
		:style="{
			'min-width': width + 'rpx'
		}"
		:range="range"
		:value="startIndex"
		@change="check">
		<view class="msg">
			<view 
				class="value"
				:class="value === '' ? 'input-placeholder' : ''">
				{{value === "" ? placeholder : value}}
			</view>
			<text class="iconfont icon-xiala"></text>
		</view>
	</picker>
</template>

<script>
export default {
	props:{
		/* 宽度 */
		width: {
			type: Number,
			default: 200
		},
		/* 数组 */
		range: {
			type: Array,
			default: () => []
		},
		/* 无值填充 */
		placeholder: {
			type: String,
			default: ""
		},
		/* 起始下标 */
		startIndex: {
			type: Number,
			default: 0
		},
		/* 绑定值 */
		value: {
			type: String,
			default: ""
		},
	},
	methods:{
		check(e){
			this.$emit('input',this.range[e.detail.value])
		}
	}
}
</script>

<style lang="stylus" scoped>
.picker
	position relative
	padding-left 20rpx
	border-radius 15px
	background-color var(--origin3)
	.msg
		display flex
		align-items center
	.value
		height 53rpx
		line-height 53rpx
		flex 1
		font-size 24rpx
	.iconfont
		margin 0 5px
		color var(--origin2)
</style>
