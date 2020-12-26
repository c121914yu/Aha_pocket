<!-- 账号信息设置 -->
<template>
	<view class="number-info">
		<UserAgreement
			v-if="showNotice"
			@readed="showNotice=false">
		</UserAgreement>
		<!-- VIP -->
		<view class="item wxnumber">
			<text class="iconfont icon-VIP"></text>
			<text class="label">VIP</text>
			<text class="small bind">开通VIP</text>
		</view>
		<!-- 微信号 -->
		<view class="item wxnumber">
			<text class="iconfont icon-weixin"></text>
			<text class="label">微信号</text>
			<button
				class="small"
				:class="oauths.wechat ? 'val' : 'bind'"
				open-type="getUserInfo" 
				@getuserinfo="bindWx">
				{{oauths.wechat ? "已绑定" : "点击绑定"}}
			</button>
		</view>
		<!-- 手机号 -->
		<view class="item phone">
			<text class="iconfont icon-phone"></text>
			<text class="label">手机号</text>
			<text 
				class="small"
				:class="oauths.phone ? 'val' : 'bind'"
				@click="showBindPhone=true">
				{{oauths.phone ? oauths.phone : "点击绑定"}}
			</text>
		</view>
		<!-- 是否签署协议 -->
		<view class="item phone" @click="showNotice=true">
			<text class="iconfont icon-xieyi"></text>
			<text class="label">协议状态</text>
			<text 
				class="small"
				:class="userInfo.signedNotice ? 'val' : 'bind'">
				{{userInfo.signedNotice ? "已签署" : "点击签署"}}
			</text>
		</view>
		<!-- 是否签署合同 -->
		<navigator 
			class="item phone"
			url="Contract">
			<text class="iconfont icon-hetong"></text>
			<text class="label">合同状态</text>
			<text
				class="small"
				:class="userInfo.signedContract ? 'val' : 'bind'">
				{{userInfo.signedContract ? "已签署" : "点击签署"}}
			</text>
		</navigator>
		<!-- 是否实名认证 -->
		<navigator 
			class="item authentication"
			url="Authentication">
			<text class="iconfont icon-shimingrenzheng"></text>
			<text class="label">实名认证</text>
			<text class="small bind">点击认证</text>
		</navigator>
	
		<!-- 弹窗组件 -->
		<BindPhone 
			v-if="!oauths.phone && showBindPhone" 
			@close="showBindPhone=false" 
			@success="reGetMe">
		</BindPhone>
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getMe,bindWxchat } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			userInfo: getApp().globalData.gUserInfo,
			wxNumber: "",
			showNotice: false,
			showBindPhone: false
		}
	},
	computed: {
		oauths(){
			if(this.userInfo.oauths){
				let oauths = {}
				this.userInfo.oauths.forEach(item => {
					oauths[item.oauthType] = item.oauthId
				})
				return oauths
			}
			return {}
		}
	},
	onShow() {
		this.reGetMe()
	},
	methods: {
		/* 重新获取个人信息 */
		reGetMe()
		{
			this.showNotice = false
			this.showBindPhone = false
			getMe()
			.then(res => {
				this.userInfo = res.data
				getApp().globalData.gUserInfo = res.data
			})
			.catch(err => {
				uni.navigateBack({
					delta: 1,
					success: () => {
						this.gToastError("出现BUG")
					}
				})
			})
		},
		/* 绑定微信号 */
		bindWx()
		{
			if(!this.oauths.wechat){
				this.gLoading(this, true)
				uni.getUserInfo({
					provider: 'weixin',
					withCredentials: true,
					lang: 'zh_CN',
					success: res => {
						uni.login({
							provider: 'weixin',
							success: (loginRes) => {
								bindWxchat({
									code: loginRes.code
								})
								.then(res => {
									console.log(res.data)
									this.gToastSuccess("绑定成功")
									this.reGetMe()
									this.gLoading(this, false)
								})
								.catch(() => {
									this.gLoading(this, false)
								})
							}
						})
					},
					fail: () => {
						this.gLoading(this, false)
					}
				})
			}
		}
	}
} 
</script>

<style lang="stylus" scoped>
.number-info
	width 100%
	min-height 100vh
	background-color var(--white1)
	.item
		margin-bottom 2px
		padding 10px 20px
		background-color #FFFFFF
		display flex
		align-items center
		.iconfont
			font-size 44rpx
			color var(--origin2)
		.label
			margin-left 25rpx
			flex 1
			color var(--black)
			font-size 26rpx
		.val
			color var(--gray2)
		.bind
			color var(--origin2)
		button
			background-color transparent
</style>
