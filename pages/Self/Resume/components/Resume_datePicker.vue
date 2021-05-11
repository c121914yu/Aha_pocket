<!-- 
	简历日期选择组件
 -->
<template>
	<view class="picker">
		<picker
			mode="date"
			:start="startTime"
			:end="endTime"
			fields="month"
			:value="startVal"
			@change="pickered">
			<view class="data-picker">
				<view class="label">{{label}}</view>
				<view
					class="value"
					:class="value ? '' : 'input-placeholder'">
					<text>{{value ? value : placeholder}}</text>
				</view>
				<text class="iconfont icon-xiala"></text>
			</view>
		</picker>
		<view v-if="is_today" class="today">
			<view class="blank"></view>
			<button 
				v-if="value !== '至今'" 
				class="btn-today"
				@click="$emit('input','至今')">
				至今
			</button>
		</view>
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
		is_today: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			startVal: ""
		};
	},
	created() {
		this.startVal = this.value.replace("/","-")
	},
	methods: {
		/**
		 * 点击选择时间,'-'改成'/'，触发更新
		 * @param {Object} e 日期选择器参数
		 */
		pickered(e) 
		{
			let value = e.detail.value
			value = value.replace("-","/")
			this.$emit('input', value)
		},
	}
}
</script>

<style lang="stylus" scoped>
.picker
	position relative
	.data-picker
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
	.today
		margin-top -10px
		display flex
		.blank
			height 20px
		.btn-today
			height 20px
			width 40px
			text-align center
			line-height 20px
			padding 0
			border-radius 22px
			font-size 22rpx
</style>
