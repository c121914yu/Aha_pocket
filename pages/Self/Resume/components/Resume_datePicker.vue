<template>
	<picker
		mode="date"
		:start="startTime"
		:end="endTime"
		fields="month"
		:value="value"
		@change="pickered">
		<view class="resume-input">
			<view class="label">{{label}}</view>
			<view
				class="value"
				:class="value ? '' : 'input-placeholder'">
				<text>{{value ? value : placeholder}}</text>
			</view>
			<text class="iconfont icon-xiala"></text>
		</view>
	</picker>
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
			default: "2020/5"
		},
		value: String,
		startTime: {
			type: String,
			default: "1980/1"
		},
		endTime: {
			type: String,
			default: "2030/12"
		},
	},
	data() {
		return {
			searchResult: []
		};
	},
	methods: {
		/* 选择时间,'-'改成'/' */
		pickered(e) {
			let value = e.detail.value
			value = value.replace("-","/")
			this.$emit('input', value)
		},
	}
}
</script>

<style lang="stylus" scoped>
.resume-input
	position relative
	padding 10px 0
	.label
		font-size 24rpx
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
