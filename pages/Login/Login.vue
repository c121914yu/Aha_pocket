<template>
	<view class="login">
		<image class="logo" src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png" mode="widthFix" />
		<!-- 上次渐变背景 -->
		<view class="top"></view>
		<!-- 底部主体 -->
		<view class="bottom">
			<!-- 登录卡片 -->
			<view class="card">
				<view class="input">
					<text class="iconfont icon-user"></text>
					<input type="number" placeholder="手机号" placeholder-class="placeholderStyle" v-model="phone" />
				</view>
				<view class="input">
					<text class="iconfont icon-password"></text>
					<input style="padding-right:40px" type="text" :password="isPassword" placeholder="密码" placeholder-class="placeholderStyle" v-model="password" />
					<text class="iconfont icon-readed readed" @click="isPassword = !isPassword"></text>
				</view>
				<view class="forget-password small"><navigator url="./FindPassword" hover-class="none">忘记密码?</navigator></view>
				<button type="default" @click="login">登录</button>
				<view class="center small register"><navigator url="./Register" hover-class="none">立即注册</navigator></view>
			</view>
			<!-- 第三方登录内容 -->
			<view class="small other">
				<view class="strong">第三方登录</view>
				<button 
					class="iconfont icon-weixin weixin" 
					open-type="getUserInfo" 
					@getuserinfo="wxLogin">
				</button>
				<view style="color: var(--gray2);">微信登录</view>
				<view style="margin-top:10rpx;color:var(--gray2);">
					登录后需要同意
					<text style="color: var(--origin2);">Aha口袋用户使用协议</text>
					才可使用
				</view>
			</view>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { Login, WXLogin } from '@/static/request/api_login.js'
export default {
	data() {
		return {
			phone: '',
			password: '',
			isPassword: true // 是否展示密码
		};
	},
	methods: {
		loginSuccess(data) 
		{
			getApp().globalData.gUserInfo = data
			uni.reLaunch({
				url: '../app',
				success: () => {
					this.gToastSuccess('登录成功')
				},
				complete: () => {
					this.gLoading(this, false)
				}
			})
		},
		login() {
			if (this.phone === '') this.gToastError('手机号不能为空');
			else {
				this.gLoading(this, true);
				Login({
					phone: this.phone,
					password: this.password
				})
				.then(res => {
					uni.setStorageSync('token', res.data.token)
					this.loginSuccess(res.data.personalUserInfo)
				})
				.catch(err => {
					this.gLoading(this, false)
				})
			}
		},
		wxLogin() {
			this.gLoading(this, true);
			uni.getUserInfo({
				provider: 'weixin',
				withCredentials: true,
				lang: 'zh_CN',
				success: (res) => {
					// 获取code，请求openid
					uni.login({
						provider: 'weixin',
						success: (loginRes) => {
							console.log(loginRes);
							// 调用wx登录接口，获取token
							WXLogin({
								code: loginRes.code,
								avatarUrl: res.userInfo.avatarUrl,
								nickname: res.userInfo.nickName
							})
							.then(res => {
								uni.setStorageSync('token', res.data.token);
								this.loginSuccess(res.data.personalUserInfo);
							})
							.catch(err => {
								this.gLoading(this, false);
							});
						}
					});
				}
			});
		}
	},
	mounted() {
		/* 检查是否有存储token，验证登录身份 */
		if (uni.getStorageSync('token')) {
			// this.gLoading(this, true);
			uni.showLoading({
				mask: true,
				title: "登录中..."
			})
			this.gGetMeInfo()
			.then(res => {
				uni.hideLoading()
				this.loginSuccess(res)
			})
			.catch(err => {
				uni.hideLoading()
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.login
	position relative
	min-height 100vh
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
		height 70vh
		width 100%
		background-image var(--bg-linear)
	.bottom
		z-index 2
		position absolute
		bottom 0
		min-height 70vh
		width 100%
		padding-bottom 10px
		background-color var(--white1)
		border-top-left-radius 30px
		border-top-right-radius 30px
		display flex
		flex-direction column
		align-items center
		justify-content space-between
		.card
			transform translateY(-5vh)
			width 80%
			padding 5%
			background-color var(--white2)
			border-radius 22px
			box-shadow var(--shadow1)
			.input
				position relative
				margin 30px 0 10px
				width 100%
				padding 5px
				border-radius 40px
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
			.forget-password
				text-align end
				color var(--origin2)
			button
				margin 20px 0 15px
				color #FFFFFF
				background-color var(--origin2)
			.register
				color var(--gray2)
		.other
			display flex
			flex-direction column
			align-items center
			justify-content space-between
			.strong
				display flex
				align-items center
				justify-content center
				color var(--gray2)
				&::before
					content ''
					position absolute
					margin-left -100px
					width 22%
					height 1px
					background-color var(--gray2)
					border-radius 10px
				&::after
					content ''
					position absolute
					margin-left 100px
					width 22%
					height 1px
					background-color var(--gray2)
					border-radius 10px
			.weixin
				line-height 1
				flex 1
				color #04BE02
				background-color transparent
				font-size 45px
				&:active
					transform none
</style>
