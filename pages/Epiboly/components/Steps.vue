<!-- 外包进度 -->
<template>
	<view class="steps">
		<view 
			class="step"
			:class="[
				index === actice ? 'current' : '',
				index <= actice ? 'active' : ''
			]"
			v-for="(step,index) in steps"
			:index="index">
			<view class="left">
				<view class="dot"></view>
				<text v-if="index === actice" class="iconfont icon-jinhangzhong"></text>
			</view>
			<view class="right">
				<view class="title">{{step.title}}</view>
				<!-- 各阶段特定点击事件 -->
				<view class="small desc">
					{{step.desc}}
					<text v-if="actice===0 && index===0" class="deliver strong">点击投递简历</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		actice: {
			type: Number,
			default: 0
		},
		steps: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			
		}
	}
}
</script>

<style lang="stylus" scoped>
.steps
	margin 10px 0
	.step
		position relative
		margin-bottom 10px
		line-height 1.4
		display flex
		.left
			width 50rpx
			display flex
			justify-content center
			.dot
				margin-top 10px
				width 6px
				height 6px
				border-radius 50%
				background-color var(--gray2)
				/* 竖线 */
				&::after
					content ""
					position absolute
					margin-left 2px
					margin-top -10px
					transform translateY(-100%)
					width 4rpx
					height calc(100% - 16px)
					background-color #DCDFE6
					border-radius 10px
		.right
			margin-left 5px
			flex 1
			padding-bottom 10px
			border-bottom 1px solid #DCDFE6
			.deliver
				color var(--origin1)
				text-decoration underline
		&:first-child .dot::after
			width 0
		&.active
			.dot
				background-color var(--origin2)
				&::after
					background-color var(--origin2)
			.right .title
				color var(--origin2)
		&.current
			.dot
				background-color transparent
			.iconfont
				position absolute
				margin-top 2px
				margin-left 2rpx
				color var(--origin2)
</style>
