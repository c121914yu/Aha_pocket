<template>
	<view
		:style="{
			width: contentWidth,
			'border-radius': circle ? '22px' : '8px'
		}"
		class="Picker">
		<view 
			:style="{
				color: labelColor
			}"
			class="label">
			{{ label }}
		</view>
		<!-- 普通选择框 -->
		<picker
			v-if="!date"
			mode="selector"
			:range="arr_range"
			range-key="label"
			:value="startIndex"
			@change="select">
			<view 
				:style="{
					'border-radius': circle ? '22px' : '8px'
				}"
				class="select"
				:class="value ? '' : 'input-placeholder'">
				<text class="value">{{ value ? value.label :  placeholder}}</text>
				<text class="iconfont icon-xiala"></text>
			</view>
		</picker>
		<!-- 日期选择器 -->
		<picker
			v-else
			mode="date"
			:start="startTime"
			:end="endTime"
			fields="month"
			:value="value"
			@change="$emit('input',$event.detail.value)">
			<view 
				:style="{
					'border-radius': circle ? '22px' : '8px'
				}"
				class="select"
				:class="value ? '' : 'input-placeholder'">
				<text class="value">{{value ? value : placeholder}}</text>
			</view>
		</picker>
	</view>
</template>

<script>
export default {
	props: {
		date: {
			type: Boolean,
			default: false
		},
		/* 绑定值 */
		value: Object || String || Number,
		/* 标签颜色 */
		labelColor: {
			type: String,
			default: "#ffffff"
		},
		/* 标题 */
		label: {
			type: String,
			default: ''
		},
		/* 宽度 */
		contentWidth: {
			type: String,
			default: '100%'
		},
		circle: {
			type: Boolean,
			default: false
		},
		/* 输入框提示内容 */
		placeholder: {
			type: String,
			default: ''
		},
		/* 选择框内容 */
		arr_range: {
			type: Array,
			default: () => []
		},
		startTime: {
			type: String,
			default: "1980-1"
		},
		endTime: {
			type: String,
			default: "2030-12"
		},
	},
	computed: {
		startIndex() {
			if(!this.value){
				return 0
			}
			return this.arr_range.findIndex(item => item.value === this.value.value)
		}
	},
	methods: {
		select(e) {
			this.$emit('input', this.arr_range[e.target.value])
		}
	}
};
</script>

<style lang="stylus" scoped>
.Picker
	position relative
	margin 10px 0
	padding 1px
	background-color var(--origin2)
	display flex
	align-items center
	.label
		margin 0 10px
		font-size 22rpx
		white-space nowrap
	picker
		flex 1
	.select
		position relative
		flex 1
		height 24px
		padding 0 5px
		background-color #FFFFFF
		border 1px solid var(--origin4)
		display flex
		align-items center
		.value
			flex 1
			font-size 24rpx
		.iconfont
			color var(--origin2)
</style>
