<template>
	<view class="register">
		<image class="logo" src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png" mode="widthFix" />
		<view class="top"></view>
		<view class="bottom">
			<view class="card" v-if="!codeInput">
				<view class="input">
					<text class="iconfont icon-user"></text>
					<input type="number" placeholder="手机号" placeholder-class="placeholderStyle" v-model="phone" />
				</view>
				<view class="input">
					<text class="iconfont icon-password"></text>
					<input style="padding-right:40px" type="text" :password="isPassword" placeholder="密码" placeholder-class="placeholderStyle" v-model="password" />
					<text class="iconfont icon-readed readed" @click="isPassword = !isPassword"></text>
				</view>
				<view class="input">
					<text class="iconfont icon-password"></text>
					<input type="text" password placeholder="再次输入密码" placeholder-class="placeholderStyle" v-model="password2" />
				</view>
				<button type="default" @click="getCode">获取验证码</button>
			</view>
			<view class="code-input" v-show="codeInput">
				<view class="center">
					<text class="strong h3">{{ phone }}</text>
					正在注册账号
				</view>
				<CodeInput ref="codeInput" @getCode="getCode" @finishInput="register"></CodeInput>
				<button @click="codeInput = false">修改注册信息</button>
			</view>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { Register, sendCode } from '../../static/request/api_login.js';
var reg = /^1[3456789]\d{9}$/;
export default {
	data() {
		return {
			phone: '',
			password: '',
			password2: '',
			isPassword: true, // 是否展示密码
			codeInput: false
		};
	},
	methods: {
		/*
			name: getCode
			description: 发送验证码，跳转验证码输入界面，需要检查手机格式和密码
			input: 
				this.phone: String,手机号
				this.password: String,密码
				this.password2: String,确认密码
			return: null
		*/
		getCode() {
			if (!reg.test(this.phone)) {
				this.gToastError('手机格式错误');
			} else if (this.password === '') {
				this.gToastError('请填写密码');
			} else if (this.password !== this.password2) {
				this.gToastError('密码不一致');
			} else {
				/* 判断用户是否可以发送验证码 */
				if (getApp().globalData.gCodeTime <= 0) {
					this.gLoading(this, true);
					/* 发送验证码 */
					sendCode({
						phone: this.phone,
						type: 'register'
					})
					.then(res => {
						this.gToastSuccess(res.msg, 1000);
						this.codeInput = true;
						this.$refs.codeInput.setTimer();
						this.gLoading(this, false);
					})
					.catch(err => {
						this.gLoading(this, false);
					});
				} 
				else {
					this.codeInput = true;
					this.$refs.codeInput.setTimer();
				}
			}
		},
		/*
			name: register
			description: 注册账号
			input: 
				this.phone: String,手机号
				this.password: String,密码
				this.password2: String,第二次密码
				this.code: String,验证码
			return: null
		*/
		register(code) {
			const data = {
				phone: this.phone,
				password: this.password,
				code,
				nickname: this.phone // 用户默认的昵称
			};
			this.gLoading(this, true);
			Register(data)
			.then(res => {
				this.gToastSuccess(res.msg);
				/* 储存token */
				uni.setStorageSync('token', res.data.token);
				/* 储存个人信息 */
				getApp().globalData.gUserInfo = res.data.personalUserInfo;
				this.gLoading(this, false);
				/* 跳转主页 */
				uni.reLaunch({
					url: '../app'
				})
			})
			.catch(err => {
				this.gLoading(this, false);
			})
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
		codeText() {
			if (this.time === 0) return '获取验证码';
			else if (this.time >= 10) return `${this.time}s后获取`;
			return `0${this.time}s后获取`;
		}
	}
};
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
