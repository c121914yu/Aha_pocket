<template>
	<view class="account-info">
		<!-- 头像 -->
		<image class="avatar" src="../../static/icon/logo.png" mode="widthFix"></image>
		<!-- 各类信息列表 -->
		<!-- 手机号 -->
		<view 
			class="item phone"
			style="animation-delay: .1s">
			<text class="iconfont icon-phone"></text>
			<text class="name">手机号</text>
			<text class="value">15677751219</text>
		</view>
		<!-- 昵称 -->
		<view 
			class="item nickname"
			style="animation-delay: .2s">
			<text class="iconfont icon-huabanfuben"></text>
			<text class="name">昵称</text>
			<input 
				class="value" 
				type="text" 
				placeholder-class="placeholderStyle" 
				placeholder="用户昵称" 
				v-model="nickname"/>
		</view>
		<!-- 个性签名 -->
		<view 
			class="item main-learn"
			style="animation-delay: .7s">
			<text class="iconfont icon-huabanfuben"></text>
			<text class="name">个性签名</text>
			<input 
				class="value" 
				type="text" 
				placeholder-class="placeholderStyle" 
				placeholder="个性签名" 
				v-model="mainLearn"/>
		</view>
		<view class="save">
			<button @click="save">保存</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			phone: "15677751219",
			nickname: "",
			academy: "",
			specialty : "",
			mainLearn: "",
		}
	},
	methods:{
		save(){
			console.log(this.$data)
		}
	},
	mounted() {
		
	}
}
</script>

<style lang="stylus" scoped>
.account-info
	min-height 100vh
	width 100%
	padding 10px 5%
	background-color var(--origin2)
	padding-bottom 80px
	.avatar
		margin 10px auto
		width 250rpx
		height 250rpx
		border-radius 50%
		display block
	.item
		margin-bottom 20rpx
		padding 6px 10px
		background-color #FFFFFF
		display flex
		align-items center
		border-radius 20px
		opacity 0
		animation itemShow .6s ease forwards
		.iconfont
			font-size 50rpx
			color var(--origin4)
		.name
			margin 0 13px 0 2px
			color var(--origin5)
		.value
			flex 1
			padding 0
	.gender .radio-group
		display flex
		align-items center
		label
			margin-right 20px
			display flex
			align-items center
			.iconfont
				margin-right 5rpx
			.female
				color #188cc9
			.male
				color #ce5d91
			.private
				color var(--gray)
	.remind
		width 90%
		text-align center
		color var(--gray-font)
	.save
		position absolute
		bottom 0
		left 0
		padding 5px 0
		width 100%
		background-color var(--button-bg)
		border-top-left-radius 20px
		border-top-right-radius 20px
		button
			margin 10px auto
			width 70%
			color var(--button-bg)
			background-color #FFFFFF
/* 动画 */
@keyframes itemShow
	to
		opacity 1
</style>
