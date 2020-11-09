<template>
	<picker
		class="picker"
		:class="value === '' ? 'placeholderStyle' : ''"
		mode="date"
		:start="startTime"
		:end="endTime"
		fields="month"
		@change="$emit('input',$event.detail.value)"
	>
		<view>{{value === "" ? placeholder : value}}</view>
	</picker>
</template>

<script>
export default {
	props:{
		startTime: {
			type: String,
			default: "1980-1"
		},
		endTime: {
			type: String,
			default: "2030-12"
		},
		placeholder: {
			type: String,
			default: ""
		},
		value: {
			type: String,
			default: ""
		}
	}
}
</script>

<style lang="stylus" scoped>
.picker
	position relative
	height 54rpx
	min-width 130rpx
	line-height 54rpx
	padding 0 15rpx
	text-align center
	border-radius 15px
	background-color var(--origin3)
	font-size 24rpx
</style>
