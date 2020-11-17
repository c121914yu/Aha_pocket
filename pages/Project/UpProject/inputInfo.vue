<template>
	<view class="input-info">
		<view class="title">{{title}}:</view>
		<input 
			v-if="type === 'input'"
			class="input"
			:style="{
				width: contentWidth
			}"
			type="text"
			:value="value"
			:placeholder="placeholder"
			@input="$emit('input',$event.target.value)">
		<picker 
			v-if="type === 'select'" 
			class="select"
			mode="selector" 
			:range="list" 
			@change="select">
			<view
				class="input"
				:style="{
					width: contentWidth
				}">
				{{value}}
			</view>
			<text class="iconfont icon-xiala"></text>
		</picker>
		<view class="remark">{{remark}}</view>
	</view>
</template>

<script>
export default {
	props: {
		/* 绑定值 */
		value: {
			type: String,
			default: ''
		},
		/* 提示标题 */
		title: {
			type: String,
			default: ""
		},
		/* 类型 */
		type: {
			type: String,
			default: "input"
		},
		/* 选择框内容 */
		range: {
			type: Array,
			default: () => []
		},
		/* 输入框内容 */
		contentWidth: {
			type: String,
			default: "300rpx"
		},
		/* 输入框提示内容 */
		placeholder: {
			type: String,
			default: ""
		},
		/* 备注信息 */
		remark: {
			type: String,
			default: ""
		},
	},
	methods: {
		select(e){
			this.$emit('input',this.list[e.target.value])
		}
	},
  computed: {
    list(){
      return this.range.map(item => item.label)
    }
  }
}
</script>

<style lang="stylus" scoped>
.input-info
	width 100%
	display flex
	align-items center
	flex-wrap wrap
	.title
		margin-right 20rpx
		color var(--origin2)
		font-size 24rpx
		white-space nowrap
	.input
		height 48.484rpx
		line-height 48.484rpx
		padding 0 10rpx
		background-color var(--origin3)
		border-radius 30rpx
		font-size 24rpx
	.select
		position relative
		display flex
		align-items center
		.iconfont
			position absolute
			right 10px
			top 0
			color var(--origin2)
	.remark
		margin 10rpx 80rpx
		width 100%
		color var(--origin2)
		font-size 20rpx
</style>
