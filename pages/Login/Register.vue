<!-- 
	注册
	author yjl
 -->
<template>
	<view class="register">
		<image 
			class="logo" 
			src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png" 
			mode="widthFix" />
		<view class="top"></view>
		<view class="bottom">
			<view class="card" v-show="!is_inputCode">
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
						placeholder="再次输入密码" 
						v-model="password2.val" />
				</view>
				<button type="default" @click="onclickGetCode">获取验证码</button>
			</view>
			<view class="code-input" v-show="is_inputCode">
				<view class="center">
					<text class="strong h3">{{ phone.val }}</text>
					正在注册账号
				</view>
				<input-code 
					ref="codeInput" 
					@getCode="onclickGetCode" 
					@finishInput="register">
				</input-code>
				<button @click="is_inputCode=false">修改注册信息</button>
			</view>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { Register, sendCode } from '../../static/request/api_login.js'
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
			is_showPsw: true, // 是否展示密码
			is_inputCode: false
		}
	},
	methods: {
		/**
		 * 点击获取验证码，判断剩余时间是否大于0，大于0有效。展示验证码输入框
		 */
		onclickGetCode() 
		{
			if (!reg.test(this.phone.val)){
				this.gToastMsg('手机格式错误')
			} 
			else if(this.gIsNull([this.phone,this.password])) {}
			else if (this.password.val !== this.password2.val) {
				this.gToastMsg('密码不一致')
			}
			else {
				/* 发送验证码 */
				if(getApp().globalData.gCodeTime <= 0){
					sendCode({
						phone: this.phone.val,
						type: 'register'
					})
					this.gToastMsg("验证码已发送",false,1000)
				}
				this.is_inputCode = true
				this.$refs.codeInput.setTimer()
			}
		},
	    /**
		 * 注册账号
		 * @param {String} code 验证码
		 */
		register(code) 
		{
			const data = {
				phone: this.phone.val,
				password: this.password.val,
				code,
				nickname: this.phone.val, // 用户默认的昵称
			}
			this.gLoading(this, true)
			Register(data)
			.then(res => {
				/* 储存token */
				uni.setStorageSync('token', res.data.token)
				/* 储存个人信息 */
				getApp().globalData.gUserInfo = res.data.personalUserInfo
				/* 跳转主页 */
				uni.reLaunch({
					url: '../app',
					complete: () => {
						this.gToastSuccess("注册成功!")
					}
				})
			})
			.finally(() => this.gLoading(this, false))
		}
	}
}
</script>

<style lang="stylus" scoped>
.register
	height 100vh
	width 100%
	.logo
		z-index 5
		position absolute
		top 8vh
		left 50%
		transform translateX(-50%)
		width 20vh
		height 20vh
	.top
		z-index 1
		position absolute
		top 0
		height 80%
		width 100%
		background-image var(--bg-linear)
	.bottom
		z-index 2
		position absolute
		bottom 0
		height 60%
		width 100%
		background-color var(--white1)
		border-top-left-radius 60rpx
		border-top-right-radius 60rpx
		display flex
		flex-direction column
		align-items center
		.card
			transform translateY(-10vh)
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
			.get-code
				height 100%
				width 250px
				white-space nowrap
				text-align center
				transform translateX(5%)
				padding 5% 0
				border-top-right-radius 10px
				border-bottom-right-radius 10px
			button
				margin 20px 0 15px
				color #FFFFFF
				background-color var(--origin2)
		.code-input
			margin-top 20rpx
			width 100%
			.strong
				color var(--origin5)
			button
				margin 10px 10%
				color #FFFFFF
				background-color var(--origin2)
</style>
