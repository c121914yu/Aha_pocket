<template>
	<view class="slide-card">
		<!-- 外边框 -->
		<view class="out-border"></view>
		<!-- 内容 -->
		<view 
			class="content"
			@touchstart="touchstart"
			@touchend="touchend"
			@touchcancel="touchend"
			@touchmove="touchmove"
		>
			<image 
				:style="{
					transform: `translateX(${(-(slideIndex+1) * 100)}%)`,
					transition: imgAnimation ? 'var(--speed-slide)' : ''
				}"
				:src="img.url"
				v-for="(img,index) in showImg"
				:key="index"
			></image>
		</view>
		<!-- 轮播点 -->
		<view class="dots">
			<view 
				class="dot"
				:style="{
					backgroundColor: index === dotIndex ? 'var(--origin5)' : 'var(--origin4)'
				}"
				v-for="index in images.length" 
				:key="index">
			</view>
		</view>
	</view>
</template>

<script>
var slideTimer,chageTimer
var slideTime = 3000
export default {
	props:{
		images: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			showImg: null, // 添加首尾两张图片，方便循环
			slideIndex: 0, // 轮播图偏移下标
			tempIndex: 0,
			imgAnimation: true, // 是否展示动画
			imgWidth: 0, // 图片宽度
			startX: null, // 手指触碰的起始X坐标
		}
	},
	methods: {
		/*
			name: 配置循环时钟
			description: 开启循环时钟
			input: null
			return : null
		*/
		setTimer(){
			slideTimer = setInterval(() => {
				this.imgAnimation = true
				this.slideIndex++
			},slideTime)
		},
		/*
			name: 轮播图下标变化
			description: 监听轮播图下标变化，处理首尾图循环
			input: 当前轮播图下标 
			return : null
		*/
		indexChange(index){
			/* 滑动过程不执行 */
			if(this.startX !== null)
			{
				return
			}
			/* 延迟切换轮播图下标 */
			const setIndex = (i) => {
				chageTimer = setTimeout(() => {
					this.imgAnimation = false
					this.slideIndex = i
					setTimeout(() => {
						this.imgAnimation = true
					})
				},this.imgAnimation ? 1000 : 0)
			}
			if(index === this.images.length)
			{
				setIndex(0)
			}
			else if(index === -1)
			{
				setIndex(this.images.length-1)
			}
		},
		/*
			name: 手指触碰开始
			description: 监听手指按下事件，断开轮播计时
			input: 系统参数
			return: null
		*/
	 touchstart(e){
		 clearInterval(slideTimer)
		 clearTimeout(chageTimer)
		 /* 停止切换动画*/
		 this.imgAnimation = false
		 /* 记录起始坐标*/
		 this.startX = e.changedTouches[0].pageX
	 },
	 /*
	 	name: 手指触碰结束
	 	description: 监听手指离开事件，开始轮播计时
	 	input: null
	 	return: null
	 */
	 touchend(){
		 /* 清空坐标标记，打开滑动记录*/
		 this.startX = null
		 this.slideIndex = Math.round(this.slideIndex)
		 this.setTimer()
	 },
	 /*
	 	name: 手指移动
	 	description: 监听手指移动事件，改变图片偏移值
	 	input: 系统参数
	 	return: null
	 */
	 touchmove(e){
		 const touchX = e.changedTouches[0].pageX - this.startX
		 const rate = touchX / this.imgWidth
		 this.slideIndex -= rate
		 this.startX = e.changedTouches[0].pageX
	 }
	},
	watch:{
		slideIndex: 'indexChange'
	},
	computed:{
		/*
			name: 轮播图点下标
			description: 获取轮播图点的下标
			watch: slideIndex
			return: Number
		*/
		dotIndex(){
			if(this.slideIndex === -1)
			{
				return this.images.length - 1
			}
			else if(this.slideIndex === this.images.length)
			{
				return 0
			}
			return this.slideIndex
		}
	},
	created() {
		this.showImg = [
			this.images[this.images.length-1],
			...this.images,
			this.images[0]
		]
		this.setTimer()
	},
	mounted() {
		/* 获取图片的宽度 */
		uni.createSelectorQuery().in(this).select('.content').boundingClientRect(result => { 
			if (result)
			{ 
				this.imgWidth = result.width
			}
			else
			{ 
				this.imgWidth = 325
			} 
		}).exec()
	}
}
</script>

<style lang="stylus" scoped>
.slide-card
	position relative
	display flex
	align-items center
	justify-content center
	// 外边框样式
	.out-border
		position absolute
		width 100%
		height 100%
		border-radius 22px
		background-color var(--origin3)
	// 主体内容
	.content
		z-index 2
		width calc(100% - 20rpx)
		height calc(100% - 20rpx)
		border-radius 19px
		background-color #f7daaf
		overflow hidden
		display flex
		image
			flex-shrink 0
			width 100%
			height 100%
	// 轮播点
	.dots
		z-index 3
		position absolute
		bottom 16rpx
		display flex
		.dot
			margin 10rpx
			width 20rpx
			height 20rpx
			border-radius 50%
			transition var(--speed-hover)
</style>
