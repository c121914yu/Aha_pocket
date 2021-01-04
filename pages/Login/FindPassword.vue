<template>
	<view class="find-psw">
		<image class="logo" src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png" mode="widthFix" />
		<view class="top"></view>
		<view class="bottom">
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
				<view class="input">
					<text class="iconfont icon-password"></text>
					<input type="text" password placeholder="再次输入密码" placeholder-class="placeholderStyle" v-model="password2" />
				</view>
				<!-- 获取验证码 -->
				<view class="input code">
					<text class="iconfont icon-password"></text>
					<input type="number" placeholder="验证码:1234" placeholder-class="placeholderStyle" maxlength="6" v-model="code" />
					<view
						class="get-code"
						:style="{
							backgroundColor: time === 0 ? 'var(--origin2)' : 'var(--gray2)'
						}"
						@click="getCode"
					>
						{{ codeText }}
					</view>
				</view>
				<button type="default" @click="changePassword">修改密码</button>
			</view>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { sendCode, ChangePassword } from '../..//static/request/api_login.js';
var timer;
var reg = /^1[3456789]\d{9}$/;
export default {
	data() {
		return {
			phone: '',
			password: '',
			password2: '',
			code: '',
			isPassword: true, // 是否展示密码
			time: 0 // 倒计时
		};
	},
	methods: {
		/*
			name: getCode
			description: 发送验证码至手机号，并设置全局验证码发送倒计时
			input: 
						this.time: Number,计时时间
						this.phone: String,手机号
			return: null
		*/
		getCode() {
			/* 时间<=0时不执行 */
			if (this.time <= 0) {
				if (!reg.test(this.phone)) {
					this.gToastError('手机格式错误');
				} else {
					this.gLoading(this, true);
					/* 发送验证码 */
					sendCode({
						phone: this.phone,
						type: 'changePassword'
					})
					.then(res => {
						/* 设置全局倒计时 */
						this.time = getApp().globalData.gCodeMaxTime;
						getApp().globalData.gCodeTime = getApp().globalData.gCodeMaxTime;
						timer = setInterval(() => {
							this.time--;
							getApp().globalData.gCodeTime--;
							if (this.time <= 0) {
								clearInterval(timer);
							}
						}, 1000);
						this.gToastSuccess('验证码已发送');
						this.gLoading(this, false);
					})
					.catch(err => {
						this.gLoading(this, false);
					});
				}
			}
		},
		/*
			name: setPassword
			description: 重置密码
		*/
		changePassword() {
			/* 前端校验数据格式 */
			if (!reg.test(this.phone)) this.gToastError('手机格式错误');
			else if (this.password === '') this.gToastError('请填写密码');
			else if (this.password !== this.password2) this.gToastError('密码不一致');
			else if (this.code.length !== 4) this.gToastError('验证码错误');
			else {
				this.gLoading(this, true);
				const data = {
					phone: this.phone,
					newPassword: this.password,
					code: this.code
				};
				ChangePassword(data)
					.then(res => {
						this.gToastSuccess(res.msg);
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 500);
						this.gLoading(this, false);
					})
					.catch(err => {
						this.gLoading(this, false);
					});
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
		codeText() {
			if (this.time === 0) return '获取验证码';
			else if (this.time >= 10) return `${this.time}s后重新获取`;
			return `0${this.time}s后重新获取`;
		}
	},
	onLoad() {
		/* 
			检查全局发送验证码倒计时是否为0
			若不为0则将当前页的time设置为剩余时间
		*/
		const gTime = getApp().globalData.gCodeTime;
		if (gTime > 0) {
			/* 发送验证码倒计时 */
			this.time = gTime;
			timer = setInterval(() => {
				this.time--;
				if (this.time <= 0) {
					clearInterval(timer);
				}
			}, 1000);
		}
	}
};
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
