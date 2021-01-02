<!-- 邀请 -->
<template>
	<view class="invite">
		<view class="table">
			<view class="item invite-amount">
				<view class="title">邀请人数</view>
				<view class="value strong">5</view>
			</view>
			<view class="item get-point">
				<view class="title">获得贡献度</view>
				<view class="value strong">50</view>
			</view>
		</view>
		<!-- 二维码 -->
		<view class="QR-code">
			<image src="../../static/icon/close.png"></image>
		</view>
		<!-- 分享给好友 -->
		<button open-type="share">分享好友</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	onShareAppMessage(e){
		console.log(e)
		return {
			title: "Aha口袋",
			path: "pages/Login/Login",
			desc: "Aha口袋邀您加入",
			imageUrl: "http://blogs.jinlongyuchitang.cn/background.jpg"
		}
	},
	onLoad() {
		this.gUndesign()
	}
}
</script>

<style lang="stylus" scoped>
.invite
	padding 10px 20px
	.table
		border var(--border2)
		border-radius 8px
		display flex
		.item
			width 50%
			padding 10px
			text-align center
			.value
				color var(--origin1)
				font-size 32rpx
		.invite-amount
			border-right var(--border2)
	.QR-code
		margin 10px auto
		width 90vw
		height 90vw
		border var(--border2)
		border-radius 8px
</style>
