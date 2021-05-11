<!-- 
	账号信息设置
	author yjl
-->
<template>
	<view class="number-info">
		<!-- VIP -->
		<view class="item wxnumber">
			<text class="iconfont icon-VIP"></text>
			<text class="label">VIP</text>
			<text class="small bind" @click="onclickOpenVip">开通VIP</text>
		</view>
		<!-- 微信号 -->
		<view class="item wxnumber">
			<text class="iconfont icon-weixin"></text>
			<text class="label">微信号</text>
			<button
				class="small"
				:class="oauths.wechat ? 'val' : 'bind'"
				open-type="getUserInfo" 
				@getuserinfo="onclickBindWx">
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
				@click="is_showBindPhone=true">
				{{oauths.phone ? oauths.phone : "点击绑定"}}
			</text>
		</view>
		<!-- 是否签署协议 -->
		<view class="item phone" @click="is_showNotice=true">
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
		<!-- 绑定手机弹窗 -->
		<BindPhone 
			v-if="!oauths.phone && is_showBindPhone" 
			@close="is_showBindPhone=false" 
			@success="reGetMe">
		</BindPhone>
		<user-agreement
			v-if="is_showNotice"
			@readed="is_showNotice=false">
		</user-agreement>
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { bindWxchat } from "@/static/request/api_userInfo.js"
import userAgreement from "./UserAgreement.vue"
export default {
	components: {
		"user-agreement": userAgreement
	},
	data() {
		return {
			userInfo: getApp().globalData.gUserInfo,
			wxNumber: "",
			is_showNotice: false,
			is_showBindPhone: false
		}
	},
	computed: {
		/* 账号绑定信息，可能有微信，手机 */
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
		/**
		 * 重新获取个人信息
		 */
		reGetMe()
		{
			this.is_showNotice = false
			this.is_showBindPhone = false
			this.gGetMeInfo()
			.then(res => {
				this.userInfo = res
			})
			.catch(err => {
				this.gBackPage("获取个人信息失败")
			})
		},
		/**
		 * 开通VI
		 */
		onclickOpenVip()
		{
			this.gToastMsg("功能未开放！")
		},
		/**
		 * 绑定微信号
		 */
		async onclickBindWx()
		{
			if(!this.oauths.wechat){
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
					/* 调用wx绑定接口 */
					const userInfo = await bindWxchat(loginRes.code)
					this.gToastSuccess("绑定成功")
					this.reGetMe()
					this.gLoading(this, false)
				} catch(err) {
					console.log(err);
					this.gLoading(this, false)
				}
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
