<template>
	<view class="draw-list">
		<view 
			class="item"
			:class="item.class"
			:style="'transform:translateY(' + item.translateY + 'px) translateZ(' + item.translateZ + 'px)'"
			v-for="(item,index) in tempList"
			:key="index">
			<view class="info" @click="$emit('click',index)">
				<image :src="item.avatarUrl"></image>
				<text>{{item.nickname}} {{item.memberPhone}}</text>
			</view>
			<text
				class="iconfont icon-sort"
				@touchstart="touchstart($event,index)" 
				@touchmove="touchmove($event,index)"
				@touchend="touchend($event,index)">
			</text>
		</view>
	</view>
</template>

<script>
var initY,lastY
export default {
	data() {
		return {
			tempList: []
		}
	},
	props: {
		list: Array
	},
	methods: {
		/* 
			name: 初始化排序
			desc: 将tempList的元素排序属性清0，并重新计算所在位置
		*/
		initSort(list)
		{
			this.tempList = list.map((item,i) => {
				return {
					...item,
					translateY: 0,
					translateZ: 0,
					position: i*50,
					class: ""
				}
			})
		},
		touchstart(e,i)
		{
			this.tempList[i].class = "active"
			this.tempList[i].translateZ = 20
			initY = lastY = e.touches[0].pageY
		},
		touchmove(e,i)
		{
			/* 计算触摸移动位置，并移动触摸的DOM */
			let pointY = e.touches[0].pageY
			const translateY = pointY - initY
      /* 移动DOM的偏移量 */
			this.tempList[i].translateY = translateY
      /* 移动DOM的当前位置 */
			const position = translateY + this.tempList[i].position
      /* 拖拽方向*/
      const direction = pointY - lastY
      lastY = pointY
			/* 判断触摸的DOM是否挤占其他DOM */
			this.tempList.forEach((item,index) => {
				if(i === index) 
					return
				item.class = "animation"
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
				if(direction > 0 && diff < 0 && diff > -20)
          item.translateY = this.tempList[i].position < item.position ? -48 : 0
				else if(direction < 0 && diff > 0 && diff < 20)
          item.translateY = this.tempList[i].position > item.position ? 48 : 0
			})
		},
		touchend(e,i)
		{
			/* 重新赋值给排序数组 */
			this.tempList.forEach((item,i) => {
				item.class = ""
			})
			/* 创建临时列表进行排序 */
			const temp = JSON.parse(JSON.stringify(this.tempList))
			/* 根据translateY和position重新计算列表顺序 */
			temp.sort((a,b) => {
				return (a.translateY + a.position) - (b.translateY + b.position)
			})
			this.initSort(temp)
			this.$emit("confirm",JSON.parse(JSON.stringify(this.tempList)))
		},
	},
	created() {
		this.initSort(this.list)
	}
}
</script>

<style lang="stylus" scoped>
.item
	position relative
	margin 8px 0
	height 40px
	padding 0 10px
	background-color var(--origin2)
	color #FFFFFF
	border-radius 8px
	display flex
	align-items center
	transition none
	transform-style preserve-3d
	.info
		flex 1
		display flex
		align-items center
		text
			margin-left 5px
			font-size 14px
	.iconfont
		font-size 44rpx
	image
		width 30px
		height 30px
		border-radius 5px
	&.active
		z-index 5
		box-shadow var(--shadow2)
	&.animation
		transition .3s
</style>
