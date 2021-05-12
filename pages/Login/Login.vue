<!-- 
	登录页
	author: yjl
 -->
<template>
	<view class="login">
		<image 
			class="logo" 
			src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png" 
			mode="widthFix" />
		<!-- 上次渐变背景 -->
		<view class="top"></view>
		<!-- 底部主体 -->
		<view class="bottom">
			<!-- 登录卡片 -->
			<view class="card">
				<view class="input">
					<text class="iconfont icon-user"></text>
					<input type="number" placeholder="手机号" v-model="phone.val" />
				</view>
				<view class="input">
					<text class="iconfont icon-password"></text>
					<input 
						style="padding-right:40px" 
						type="text" 
						:password="is_showPassword" 
						placeholder="密码" 
						v-model="password.val" />
					<text class="iconfont icon-readed readed" @click="is_showPassword = !is_showPassword"></text>
				</view>
				<view class="forget-password small">
					<navigator url="./FindPassword" hover-class="none">忘记密码?</navigator>
				</view>
				<button type="default" @click="onclickLogin">登录</button>
				<!-- 暂时只给微信登录 -->
				<view class="center small register"><navigator url="./Register" hover-class="none">立即注册</navigator></view>
			</view>
			<!-- 第三方登录 -->
			<view class="small other">
				<view class="outher-login strong">第三方登录</view>
				<button 
					class="iconfont icon-weixin weixin" 
					open-type="getUserInfo" 
					@getuserinfo="onclickWxLogin">
				</button>
				<view style="color: var(--gray2)">微信登录</view>
				<view style="margin-top:10rpxcolor:var(--gray2)">
					登录后需要同意
					<text style="color: var(--origin2)">Aha口袋用户使用协议</text>
					才可使用
				</view>
			</view>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { Login, WXLogin } from '@/static/request/api_login.js'
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
			is_showPassword: true // 是否展示密码
		}
	},
	onLoad() {
		/* 检查是否有存储token，验证登录身份 */
		if (uni.getStorageSync('token')) {
			uni.showLoading({
				mask: true,
				title: '登录中...'
			})
			this.gGetMeInfo()
			.then(res => {
				this.loginSuccess(res)
			})
			.finally(() => uni.hideLoading())
		}
	},
	methods: {
		/**
		 * 成功登录，跳转主页面
		 * @param {Object} data
		 */
		loginSuccess(data) 
		{
			getApp().globalData.gUserInfo = data
			uni.reLaunch({
				url: '../app',
				success: () => {
					this.gToastSuccess('登录成功')
				}
			})
		},
		/**
		 * 点击登录
		 */
		onclickLogin() 
		{
			if (!this.gIsNull([this.phone,this.password])) {
				this.gLoading(this, true)
				Login({
					phone: this.phone.val,
					password: this.password.val
				})
				.then(res => {
					uni.setStorageSync('token', res.data.token)
					this.loginSuccess(res.data.personalUserInfo)
				})
				.finally(() => this.gLoading(this, false))
			} 
		},
		/**
		 * 微信登录，调用微信登录接口
		 */
		async onclickWxLogin() 
		{
			this.gLoading(this, true)
			try{
				/* 获取用户信息 */
				let res = await uni.getUserInfo({
					provider: 'weixin',
					withCredentials: true,
					lang: 'zh_CN'
				})
				res = res[1]
				/* 获取登录凭证，openid */
				let loginRes = await uni.login({
									provider: 'weixin'
								})
				loginRes = loginRes[1]
				/* 调用wx登录接口，获取token */
				const userInfo = await WXLogin({
									code: loginRes.code,
									avatarUrl: res.userInfo.avatarUrl,
									nickname: res.userInfo.nickName
								})
				uni.setStorageSync('token', userInfo.data.token)
				this.loginSuccess(userInfo.data.personalUserInfo)
				this.gLoading(this, false)
			}catch(e){
				this.gLoading(this, false)
				this.gToastError("请求错误")
			}
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
			transform translateY(-2vh)
			display flex
			flex-direction column
			align-items center
			justify-content space-between
			.outher-login
				display flex
				align-items center
				justify-content center
				color var(--gray2)
				&::before
					content ''
					position absolute
					margin-left -55%
					width 22%
					height 1px
					background-color var(--gray2)
					border-radius 10px
				&::after
					content ''
					position absolute
					margin-left 55%
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
