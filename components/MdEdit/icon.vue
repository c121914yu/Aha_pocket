<template>
	<view 
		class="icon"
		:style="{
			color: color, 
			fontSize: fontSize
		}" 
		v-html="type" 
		@click="toclick">
	</view>
</template>

<script>
export default {
	props: {
		type: {
			type: String,
			default: '&#xe644;'
		},
		color: {
			type: String,
			default: '#666666'
		},
		fontSize: {
			type: String,
			default: '34rpx'
		}
	},
	methods: {
		toclick() {
			this.$emit('click')
		}
	}
}
</script>

<style lang="stylus" scoped>
@font-face
	font-family 'jin'
	/** 阿里巴巴矢量图标库的字体库地址，可以替换自己的字体库地址 **/
	src url('https://at.alicdn.com/t/font_2219105_chputgdi6xe.ttf') format('truetype')
.icon 
	font-family jin !important
	text-align center
	padding 10rpx 0
</style>
