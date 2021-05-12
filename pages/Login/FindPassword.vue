<!-- 
	找回密码
	author yjl
 -->
<template>
	<view class="find-psw">
		<image class="logo" src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png" mode="widthFix" />
		<view class="top"></view>
		<view class="bottom">
			<view class="card">
				<view class="input">
					<text class="iconfont icon-user"></text>
					<input 
						type="number" 
						placeholder="手机号" 
						v-model="phone.val" />
				</view>
				<view class="input">
					<text class="iconfont icon-password"></text>
					<input 
						style="padding-right:40px" 
						type="text" 
						:password="is_showPsw" 
						placeholder="密码" 
						v-model="password.val" />
					<text class="iconfont icon-readed readed" @click="is_showPsw=!is_showPsw"></text>
				</view>
				<view class="input">
					<text class="iconfont icon-password"></text>
					<input 
						type="text" 
						password 
						placeholder="确认密码"
						v-model="password2.val" />
				</view>
				<!-- 获取验证码 -->
				<view class="input code">
					<text class="iconfont icon-password"></text>
					<input 
						type="number" 
						maxlength="6" 
						placeholder="验证码"
						v-model="code.val" />
					<view
						class="get-code"
						:style="{
							backgroundColor: time === 0 ? 'var(--origin2)' : 'var(--gray2)'
						}"
						@click="onclickGetCode"
					>
						{{ codeText }}
					</view>
				</view>
				<button type="default" @click="onclickChange">修改密码</button>
			</view>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { sendCode, ChangePassword } from '@/static/request/api_login.js'
var timer
var reg = /^1[3456789]\d{9}$/
export default {
	data() {
		return {
			phone: {
				val: "",
				errMsg: "手机号不能为空"
			},
			password: {
				val: "",
				errMsg: "密码不能为空"
			},
			password2: {
				val: "",
				errMsg: "请再次输入密码"
			},
			code: {
				val: "",
				errMsg: "验证码不能为空"
			},
			is_showPsw: true, // 是否展示密码
			time: 0 // 倒计时
		}
	},
	computed: {
		/**
		 * 发送验证码文字
		 */
		codeText() {
			if (this.time === 0) {
				return '获取验证码'
			} 
			else if (this.time >= 10) {
				return `${this.time}s后重新获取`
			} 
			return `0${this.time}s后重新获取`
		}
	},
	onLoad() {
		/* 
			检查全局发送验证码倒计时是否为0
			若不为0则将当前页的time设置为剩余时间
		*/
		if (getApp().globalData.gCodeTime > 0) {
			/* 发送验证码倒计时 */
			this.time = getApp().globalData.gCodeTime
			timer = setInterval(() => {
				this.time--
				if (this.time <= 0) {
					clearInterval(timer)
				}
			}, 1000)
		}
	},
	methods: {
		/**
		 * 点击获取验证码，判断剩余时间是否大于0，大于0有效
		 */
		onclickGetCode() 
		{
			/* 时间<=0时不执行 */
			if (this.time <= 0) {
				if (!reg.test(this.phone.val)) {
					this.gToastMsg('手机格式错误')
				} 
				else {
					this.gLoading(this, true)
					/* 发送验证码 */
					sendCode({
						phone: this.phone.val,
						type: 'changePassword'
					})
					.then(res => {
						/* 设置全局倒计时 */
						this.time = getApp().globalData.gCodeMaxTime
						getApp().globalData.gCodeTime = getApp().globalData.gCodeMaxTime
						timer = setInterval(() => {
							this.time--
							getApp().globalData.gCodeTime--
							if (this.time <= 0) {
								clearInterval(timer)
							}
						}, 1000)
						this.gToastMsg('验证码已发送')
					})
					.finally(() => this.gLoading(this, false))
				}
			}
		},
	    /**
		 * 点击修改密码，
		 */
		onclickChange() 
		{
			/* 前端校验数据格式 */
			if (!reg.test(this.phone.val)){
				this.gToastMsg('手机格式错误')
			} 
			else if(this.gIsNull([this.phone,this.password])) {}
			else if (this.password.val !== this.password2.val) {
				this.gToastMsg('密码不一致')
			}
			else if (this.code.val.length !== 4) {
				this.gToastMsg('验证码错误')
			}
			else {
				this.gLoading(this, true)
				ChangePassword({
					phone: this.phone.val,
					newPassword: this.password.val,
					code: this.code.val
				})
				.then(res => {
					uni.navigateBack({
						delta: 1,
						complete: () => {
							this.gToastSuccess("修改密码成功")
						}
					})
				})
				.finally(() => this.gLoading(this, false))
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.find-psw
	height 100vh
	width 100%
	.logo
		z-index 5
		position absolute
		top 3vh
		left 50%
		transform translateX(-50%)
		width 20vh
		height 20vh
	.top
		z-index 1
		position absolute
		top 0
		height 70%
		width 100%
		background-image var(--bg-linear)
	.bottom
		z-index 2
		position absolute
		bottom 0
		height 70%
		width 100%
		background-color var(--white1)
		border-top-left-radius 60rpx
		border-top-right-radius 60rpx
		display flex
		flex-direction column
		align-items center
		.card
			transform translateY(-5vh)
			width 80%
			padding 5%
			background-color var(--white2)
			border-radius 50rpx
			box-shadow var(--shadow1)
			.input
				position relative
				margin 20px 0
				width 100%
				padding 5px
				border-radius 10px
				box-shadow var(--shadow-beside)
				font-size 30rpx
				display flex
				align-items center
				text
					position absolute
					margin-left 8px
					font-size 46rpx
					color var(--gray1)
					&.readed
						right 10px
				input
					width 100%
					padding-left 40px
				&.code
					padding 0 5px
					input
						width 170px
					.get-code
						height 100%
						width 100%
						white-space nowrap
						text-align center
						transform translateX(5%)
						color #FFFFFF
						padding 5% 0
						border-top-right-radius 10px
						border-bottom-right-radius 10px
			button
				margin 20px 0 15px
				color #FFFFFF
				background-color var(--origin2)
</style>
