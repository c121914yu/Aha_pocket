<template>
	<view class="resume-pickercity">
		<view class="label">{{label}}</view>
		<view
			class="value"
			:class="value ? '' : 'input-placeholder'"
			@click="is_selectCity=true">
			<text>{{value ? value : placeholder}}</text>
			<text class="iconfont icon-xiala"></text>
		</view>
		<select-city 
			v-if="is_selectCity" 
			@select="$emit('input',$event);is_selectCity=false" 
			v-model="value">
		</select-city>
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
			default: " "
		},
		value: String | Number,
	},
	data() {
		return {
			is_selectCity: false
		}
	},
}
</script>

<style lang="stylus" scoped>
.resume-pickercity
	padding 10px 0
	.label
		font-size 26rpx
	.value
		position relative
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
