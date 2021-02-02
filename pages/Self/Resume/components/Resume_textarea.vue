<template>
	<view class="resume-input">
		<view class="label">{{label}}</view>
		<textarea 
			class="value" 
			:value="value"
			:placeholder="placeholder"
			placeholder-style="font-weight:500;color var(--gray2)"
			@input="$emit('input',$event.detail.value)"/>
	</view>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: ""
		},
		placeholder: {
			type: String,
			default: ""
		},
		value: String,
	}
}
</script>

<style lang="stylus" scoped>
.resume-input
	position relative
	padding 10px 0
	.label
		font-size 26rpx
	.value
		height 300px
		border-bottom var(--border2)
		border-radius 4px
		width 100%
		font-size 28rpx
		font-weight 700
		padding 0
		color var(--black)
		border-radius 0
</style>
