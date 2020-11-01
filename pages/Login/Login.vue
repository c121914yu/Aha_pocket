<template>
	<view class="login">
		<image class="logo" src="/static/icon/logo.png" mode="widthFix" />
		<!-- 上次渐变背景 -->
		<view class="top"></view>
		<!-- 底部主体 -->
		<view class="bottom">
			<!-- 登录卡片 -->
			<view class="card">
				<view class="input">
					<text class="iconfont icon-user"></text>
					<input 
						type="number" 
						placeholder="手机号" 
						placeholder-class="placeholderStyle" 
						v-model="phone"/>
				</view>
				<view class="input">
					<text class="iconfont icon-password"></text>
					<input 
						style="padding-right:40px" 
						type="text" 
						:password="isPassword"
						placeholder="密码" 
						placeholder-class="placeholderStyle" 
						v-model="password"
					/>
					<text class="iconfont icon-readed readed" @click="isPassword=!isPassword"></text>
				</view>
				<view class="forget-password small">
					<navigator url="./FindPassword" hover-class="none">忘记密码?</navigator>
				</view>
				<button type="default" @click="login">登录</button>
				<view class="center small register">
					<navigator url="./Register" hover-class="none">立即注册</navigator>
				</view>
			</view>
			<!-- 第三方登录内容 -->
			<view class="other small strong">
				第三方登录
			</view>
			<button class="iconfont icon-weixin weixin" open-type="getUserInfo" @getuserinfo="wxLogin"></button>
			<text class="small" style="color: var(--gray-font);">微信登录</text>
			<text class="small" style="margin-top:10rpx;color:var(--gray-font);">登录后需要同意<text style="color: var(--origin-font);">Aha口袋用户使用协议</text>才可使用</text>
		</view>
	</view>
</template>

<script>
import { Login,WXLogin } from "../..//static/request/api_login.js"
import { getMe } from "../..//static/request/api_userInfo.js"
export default {
	data() {
		return {
			phone: "",
			password: "",
			isPassword: true,// 是否展示密码
		}
	},
	methods: {
		loginSuccess(){
			this.gToastSuccess("登录成功")
			setTimeout(() => {
				uni.reLaunch({
					url: "../app",
				})
			},1000)
		},
		login(){
			if(this.phone === "")
			{
				this.gToastError("手机号不能为空")
			}
			else
			{
				Login({
					phone: this.phone,
					password: this.password
				})
				.then(res => {
					uni.setStorageSync("token",res.data.token)
					getApp().globalData.gUserInfo = res.data.personalUserInfo
					this.loginSuccess()
				})
			}
		},
		wxLogin(){
			uni.getUserInfo({
				provider: 'weixin',
				withCredentials: true,
				lang: "zh_CN",
				success: (res) => {
					// 获取code，请求openid
					uni.login({
						provider: 'weixin',
						success: (loginRes) => {
							const data = {
								code: loginRes.code,
								avatarUrl: res.userInfo.avatarUrl,
								nickName: res.userInfo.nickName,
							}
							// 调用wx登录接口，获取token
							WXLogin(data)
							.then(res => {
								if(res.success){
									uni.setStorageSync("token",res.data.token)
									this.loginSuccess()
								}
							})
						}
					})
				}
			})
		}
	},
	mounted() {
		/* 检查是否有存储token，验证登录身份 */
		if(uni.getStorageSync("token"))
		{
			getMe()
			.then(res => {
				getApp().globalData.gUserInfo = res.data
				this.loginSuccess()
			})
			.catch(err => {
				uni.clearStorageSync("token")
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.login
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
		background-image var(--bg-color3)
	.bottom
		z-index 2
		position absolute
		bottom 0
		height 70%
		width 100%
		background-color var(--bg-color1)
		border-top-left-radius 60rpx
		border-top-right-radius 60rpx
		display flex
		flex-direction column
		align-items center
		.card
			left 10%
			transform translateY(-5vh)
			width 80%
			padding 5%
			background-color var(--bg-color2)
			border-radius 50rpx
			box-shadow var(--shadow1)
			.input
				position relative
				margin 30px 0 10px
				width 100%
				padding 0 5px
				border-radius 40px
				box-shadow 0 4px 3px #dcdddd
				font-size 30rpx
				display flex
				align-items center
				text
					position absolute
					margin-left 8px
					font-size 46rpx
					color var(--gray)
					 &.readed
						right 10px
				input
					width 100%
					padding-left 40px
			.forget-password
				text-align end
				color var(--origin-font)
			button
				margin 20px 0 15px
				color #FFFFFF
				background-color var(--button-bg)
			.register
				color var(--gray)
		.other
			margin-top 15rpx
			display flex
			align-items center
			justify-content center
			color var(--gray-font)
			&::before
				content ''
				position absolute
				margin-left -100px
				width 22%
				height 2px
				background-color #dcdddd
				border-radius 10px
			&::after
				content ''
				position absolute
				margin-left 100px
				width 22%
				height 2px
				background-color #dcdddd
				border-radius 10px
		.weixin
			line-height 1.5
			color #04BE02
			background-color transparent
			font-size 80rpx
			display block
			&:active
				transform none
</style>
