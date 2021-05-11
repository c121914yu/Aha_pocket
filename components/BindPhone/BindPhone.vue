<!-- 绑定手机号 -->
<template>
	<view class="bind-phone fix-screen">
		<div class="content">
			<view class="h3 center">绑定手机号</view>
			<form @submit="bind">
				<view class="item">
					<input class="input" name="phone" type="text" placeholder="手机号" v-model="phone">
					<text class="iconfont icon-phone"></text>
				</view>
				<view class="item code">
					<input class="input" name="code" type="text" placeholder="验证码" v-model="code">
					<text class="iconfont icon-password"></text>
					<button 
						:class="time === 0 ? 'active' : 'undo'"
						class="btn"
						@click="getCode">
						{{codeText}}
					</button>
				</view>
				<view class="btns">
					<button class="btn" form-type="submit">绑定</button>
					<button class="btn cancel" @click="$emit('close')">取消</button>
				</view>
			</form>
		</div>
	</view>
</template>

<script>
import { sendCode } from "@/static/request/api_login.js"
import { bindPhone } from "@/static/request/api_userInfo.js"
var timer
var reg = /^1[3456789]\d{9}$/
export default {
	data() {
		return {
			time: 0,
			phone: "",
			code: ""
		}
	},
	computed: {
		/* 获取验证码提示文字 */
		codeText() {
			if (this.time === 0) return '获取验证码';
			else if (this.time >= 10) return `${this.time}s后重新获取`;
			return `0${this.time}s后重新获取`;
		}
	},
	created() {
		this.time = getApp().globalData.gCodeTime
		if(this.time > 0){
			this.setTime()
		}
	},
	methods: {
		/* 设置全局倒计时 */
		setTime()
		{
			timer = setInterval(() => {
				this.time--
				getApp().globalData.gCodeTime--
				if (this.time <= 0) {
					clearInterval(timer)
				}
			}, 1000)
		},
		/* 发送验证码 */
		getCode() 
		{
			if (this.time <= 0) {
				if (!reg.test(this.phone)) {
					this.gToastError('手机格式错误')
				} 
				else {
					/* 发送验证码 */
					sendCode({
						phone: this.phone,
						type: 'bindPhone'
					})
					.then(res => {
						this.time = getApp().globalData.gCodeMaxTime
						getApp().globalData.gCodeTime = getApp().globalData.gCodeMaxTime
						this.setTime()
						this.gToastSuccess('验证码已发送')
					})
				}
			}
		},
		/* 绑定手机,调取API */
		bind(e)
		{
			const data = e.detail.value
			if (!reg.test(data.phone)) {
				this.gToastError('手机格式错误')
			}
			else if(data.code === ""){
				this.gToastError('验证码不能为空')
			}
			else if(data.code.length !== 4){
				this.gToastError('验证码错误')
			}
			else{
				bindPhone(data)
				.then(res => {
					this.gToastSuccess("绑定成功")
					this.$emit("success")
				})
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.bind-phone
	.content
		width 80%
		border-radius 8px
		.item
			position relative
			margin 10px 0
			display flex
			align-items center
			.iconfont
				position absolute
				left 10px
				color var(--origin2)
				font-size 34rpx
			.input
				flex 1
				padding-left 30px
				border var(--border2)
			.btn
				margin-left 10px
				padding 0 10px
				font-weight 24rpx
				border-radius 8px
				&.active
					background-color var(--origin2)
				&.undo
					background-color var(--gray1)
					&:active
						transform none
		.btns
			display flex
			.btn
				width 35%
				padding 0 10px
			.cancel
				background-color var(--gray2)
</style>
