<template>
	<picker
		class="picker"
		:style="{
			'min-width': width + 'rpx'
		}"
		:range="range"
		:value="startIndex"
		@change="check">
		<view>
			<text 
				class="value"
				:class="value === '' ? 'placeholderStyle' : ''">
				{{value === "" ? placeholder : value}}
			</text>
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
	padding 5rpx 20rpx
	border-radius 15px
	background-color var(--origin2)
	view
		display flex
		align-items center
	.value
		flex 1
	.iconfont
		margin 0 5px
		color var(--origin4)
</style>
