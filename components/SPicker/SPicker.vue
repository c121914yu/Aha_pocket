<template>
	<picker
		class="picker"
		:style="{
			'min-width': width + 'rpx'
		}"
		:range="range"
		:value="startIndex"
		@change="check">
		<view class="content">
			<view 
				class="value"
				:class="value === '' ? 'placeholderStyle' : ''">
				{{value === "" ? placeholder : value}}
			</view>
			<text class="iconfont icon-xiala"></text>
		</view>
	</picker>
</template>

<script>
export default {
	props:{
		width: {
			type: Number,
			default: 200
		},
		range: {
			type: Array,
			default: () => []
		},
		placeholder: {
			type: String,
			default: ""
		},
		startIndex: {
			type: Number,
			default: 0
		},
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
	background-color var(--origin2)
	.content
		display flex
		align-items center
	.value
		height 53rpx
		line-height 53rpx
		flex 1
	.iconfont
		margin 0 5px
		color var(--origin4)
</style>
