<!-- 电子前面 -->
<template>
	<view class="signature">
		<canvas
			canvas-id="signatureCanvas"
			class="canvas"
			@touchstart="touchstart" 
			@touchmove="touchmove" 
			@touchend="touchend">
		</canvas>
		<view class="btns">
			<button @click="confirm">完成</button>
			<button
				class="clear"
				@click="clear">
				清空
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			canvasW: 0, // 画布宽
			canvasH: 0, // 画布高
			ctx: "", // 画笔
			points: [], //路径点集合 
		}
	},
	methods: {
		/* 
			name: 初始化画布
			desc: 初始化画笔，设置画笔样式
			time: 2020/10/27
		*/
		initCanvas() {
			//创建绘图对象
			this.ctx = uni.createCanvasContext("signatureCanvas", this)
			//设置画笔样式
			this.ctx.lineWidth = 3
			this.ctx.lineCap = "round"
			this.ctx.lineJoin = "round"
		},
		/*
			name: 触摸开始
			desc: 获取触摸的坐标，并让画笔重新进入绘制状态
			time: 2020/10/27
		*/
		touchstart(e) {
			let startX = e.changedTouches[0].x
			let startY = e.changedTouches[0].y
			let startPoint = {
				X: startX,
				Y: startY
			}
			this.points.push(startPoint)
			//每次触摸开始，开启新的路径
			this.ctx.beginPath()
		},
		/*
			name: 触摸移动
			desc: 获取触摸的坐标，将坐标点添加到points绘制点中，触发draw绘制方式
			change:
							this.points: Array,待绘制的点
			time: 2020/10/27
		*/
		touchmove(e) {
			let moveX = e.changedTouches[0].x
			let moveY = e.changedTouches[0].y
			let movePoint = {
				X: moveX,
				Y: moveY
			}
			this.points.push(movePoint)
			if (this.points.length >= 2) {
				this.draw()
			}
		},
		/*
			name: 触摸结束
			desc: 清空待绘制点
			time: 2020/10/27
		*/
		touchend() {
			this.points = []
		},
		/*
			name: 绘制点
			desc: 根据待绘制的点points中第一和第二个元素绘制一条直线，并将第一个点去掉
						第二次绘制时，将第二个点作为起点。
			input:
						this.points: Array,待绘制点
			change:
						this.points: Array,待绘制点
			time: 2020/10/27
		*/
		draw() {
			/* 获取两个点坐标 */
			let point1 = this.points[0]
			let point2 = this.points[1]
			/* 去除掉待绘制的第一个点 */
			this.points.shift()
			/* 绘制直线 */
			this.ctx.moveTo(point1.X, point1.Y)
			this.ctx.lineTo(point2.X, point2.Y)
			this.ctx.stroke()
			this.ctx.draw(true)
		},
		/*
			name: 清空画布
			desc: 绘制空图清空画笔
			time: 2020/10/27
		*/
		clear() {
			this.ctx.clearRect(0, 0, this.canvasW, this.canvasH)
			this.ctx.draw(true)
		},
		confirm() {
			uni.showLoading({
				title: "生成签名中..."
			})
			this.ctx.draw(false,uni.canvasToTempFilePath({
				canvasId: "signatureCanvas",
				fileType: "jpg",
				quality: 1,
				success: (res) => {
					this.$emit("confirm",res.tempFilePath)
				},
				fail: (err) => {
					this.gToastError("生成失败")
				},
				complete: () => {
					uni.hideLoading()
				}
			},this))
		},
	},
	created() {
		uni.getSystemInfo({
			success: (res) => {
				this.canvasW = res.windowWidth
			  this.canvasH = res.windowHeight
			}
		})
		this.initCanvas()
	}
}
</script>

<style lang="stylus" scoped>
.signature
	z-index 15
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	padding 2px
	background-color #FFFFFF
	display flex
	flex-direction column
	.canvas
		width calc(100% - 4px)
		flex 1
		border 1px solid rgba(144,140,139,0.65)
		border-radius 5px
	.btns
		padding 10px
		display flex
		justify-content space-around
		button
			width 30%
		.clear
			background-color transparent
			color var(--origin3)
			border 1px solid var(--origin3)
</style>
