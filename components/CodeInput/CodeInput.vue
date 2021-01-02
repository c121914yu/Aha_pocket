<template>
	<view class="code">
		<view class="center">请输入验证码</view>
		<view class="small center">(验证码:1234)</view>
		<view @click="startInput">
			<!-- 辅助输入框，用于调起键盘 -->
			<input 
				class="unshow-input"
				type="number" 
				maxlength="6"
				:focus="focusIndex != -1"
				v-model="code"
				@input="inputCode"
				@blur="focusIndex=-1"/>
			<!-- 展示输入内容 -->
			<view class="inputs">
				<view 
					class="item"
					:class="index === focusIndex ? 'focus' : ''"
					v-for="index in codeLen"
					:key="index">
					{{code[index] || ''}}
				</view>
			</view>
		</view>
		<!-- 重新获取提示 -->
		<view class="sendCode" @click="sendCode">{{codeText}}</view>
	</view>
</template>

<script>
var timer
export default {
	data() {
		return {
			codeLen: 4,
			code: "", // 验证码
			focusIndex: -1, // 聚焦的下表
			maxTime: 10,
			time: 0,
		}
	},
	methods: {
		/*
			name: 配置定时器
			description: 配置定时器
			input: 
						globalData.gCodeTime： Number,当前倒计时
						globalData.gCodeMaxTime: Number,总倒计时时长
			return: null
		*/
		setTimer(){
			this.code = ""
			clearInterval(timer)
			/* 
				设置全局等待时间
				如果全局倒计时为0，则设为最大倒计时
				如果不为0，则设为当前倒计时
			*/
			const gTime = getApp().globalData.gCodeTime
			getApp().globalData.gCodeTime = gTime <= 0 ? getApp().globalData.gCodeMaxTime : gTime
			this.time = getApp().globalData.gCodeTime
			timer = setInterval(() => {
				getApp().globalData.gCodeTime--
				this.time--
				if(this.time <= 0)
				{
					/* 清空全局等待时间 */
					getApp().globalData.gCodeTime = 0
				  clearInterval(timer)
				}
			},1000)
		},
		/* 
			name: 发送验证码
			description: 判断是否可以满足发送验证码条件
			input: null
			return: null
		*/
		sendCode(){
			/* 时间为0执行 */
			if(this.time <= 0){
				this.$emit("getCode")
				this.setTimer()
			}
		},
		/*
			name: 开始输入
			description: 聚焦最后一个空白的输入框
			input: null
			return: null
		*/
		startInput()
		{
			this.focusIndex = this.code.length
		},
		/*
			name: 监测输入内容
			description: 计算输入长度，改变聚焦框
			input: null
			return: null
		*/
		inputCode()
		{
			this.focusIndex = this.code.length
			if(this.focusIndex === this.codeLen)
			{
				this.focusIndex = -1
				this.$emit("finishInput",this.code)
				this.code = ''
			}
		}
	},
	computed: {
		/*
			name: codeText
			description: 获取验证码文本内容
			input: 
						this.time: Number,倒计时
			return: 
						获取验证码
						0ns后获取
						ns后获取
		*/
		codeText(){
			if(this.time === 0)
				return "获取验证码"
			else if(this.time >= 10)
				return `${this.time}s后重新获取`
			return `0${this.time}s后重新获取`
		}
	}
}
</script>

<style lang="stylus" scoped>
.code
	margin 20rpx auto
	width 90%
	.unshow-input
		position absolute
		width 0
		height 0
	.inputs
		z-index 2
		margin 10px 0
		display flex
		justify-content center
		.item
			margin 0 10rpx
			width 80rpx
			height 80rpx
			border 1px solid var(--black)
			border-radius 10px
			font-size 40rpx
			text-align center
			line-height 80rpx
			&.focus
				border-color var(--origin2)
				box-shadow 0 0 5px var(--origin2)
	.sendCode
		text-align end
</style>
