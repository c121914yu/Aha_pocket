<template>
	<view class="draw-list">
		<view
			class="item"
			:class="item.class"
			:style="{
				'transform': `translateY(${item.translateY}px)`
			}"
			v-for="(item, index) in tempList"
			:key="index"
			>
			<view class="info" @click="$emit('click', index)">
				<image class="img" :src="item.avatarUrl"></image>
				<text class="text">{{ item.trueName || item.nickname }}</text>
			</view>
			<view 
				class="right"
				@touchstart="ontouchstart($event, index)"
				@touchmove.stop="ontouchmove($event, index)" 
				@touchend="ontouchend($event, index)">
				<text class="iconfont icon-sort"></text>
			</view>
		</view>
	</view>
</template>

<script>
var initY, lastY,timer
export default {
	data() {
		return {
			tempList: []
		}
	},
	methods: {
	    /**
		 * 初始化排序
		 * @param { Array } list 成员数组
		 * 将tempList的元素排序属性清0，并重新计算所在位置
		 */
		initSort(list) 
		{
			this.tempList = list.map((item, i) => ({
					...item,
					translateY: 0,
					position: i * 50,
					class: ''
			}))
		},
		/**
		 * 触摸排序图标
		 * @param {Object} e 默认参数
		 * @param {Object} i 触碰对应的下标
		 */
		ontouchstart(e, i) 
		{
			this.tempList[i].class = 'active'
			initY = lastY = e.touches[0].pageY
			uni.vibrateShort()
		},
		/**
		 * 移动过程，实时拖拽当前DOM，并计算其他DOM
		 * @param {Object} e 默认参数
		 * @param {Object} i 触碰对应的下标
		 */
		ontouchmove(e, i) 
		{
			/* 计算触摸移动位置，并移动触摸的DOM */
			let pointY = e.touches[0].pageY
			const translateY = pointY - initY
			/* 移动DOM的偏移量 */
			this.tempList[i].translateY = translateY
			/* 计算DOM的当前位置 */
			const position = translateY + this.tempList[i].position
			/* 拖拽方向*/
			const direction = pointY - lastY
			lastY = pointY
			/* 判断触摸的DOM是否挤占其他DOM */
			this.tempList.forEach((item, index) => {
				if (i === index) {
					return
				}
				const diff = item.position + item.translateY - position
				/* 
				  direction > 0 向下
				  direction < 0 向上
				  拖动的4种情况
				  1. 向下拖拽，触碰下边缘
					1.1 拖拽DOM原位置在当前模块下方：位移为0
					1.2 拽DOM原位置在当前模块上方：向上位移，数值为负
				  2. 向上拖拽，触碰上边缘
					1.1 拖拽DOM原位置在当前模块下方: 向下位移，数值为正
					1.2 拽DOM原位置在当前模块上方：位移为0
				*/
				if (direction > 0 && diff < 0 && diff > -20){
					item.translateY = this.tempList[i].position < item.position ? -48 : 0
				} 
				else if (direction < 0 && diff > 0 && diff < 20) {
					item.translateY = this.tempList[i].position > item.position ? 48 : 0
				}
			})
		},
		ontouchend(e, i) 
		{
			/* 根据translateY和position重新计算列表顺序 */
			this.tempList.sort((a, b) => {
				return a.translateY + a.position - (b.translateY + b.position)
			})
			/* 重新赋值给排序数组 */
			this.tempList.forEach((item, i) => {
				item.translateY = 0
				item.position = i * 50,
				item.class = ""
			})
			this.$emit('confirm', this.tempList)
		}
	}
};
</script>

<style lang="stylus" scoped>
.draw-list
	.item
		position relative
		margin 8px 0
		height 40px
		padding 0 10px
		background-color var(--nav-color)
		color #FFFFFF
		border-radius 8px
		display flex
		align-items center
		// transition 0.3s
		&.active
			z-index 5
			box-shadow var(--shadow2)
			background-color var(--origin2)
			// transition none
		.info
			display flex
			align-items center
			.text
				margin-left 5px
				font-size 14px
		.right
			flex 1
			text-align end
			.iconfont
				font-size 40rpx
		.img
			width 30px
			height 30px
			border-radius 5px
</style>
