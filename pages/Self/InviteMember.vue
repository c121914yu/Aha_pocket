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
		<view class="QR-code" @click="preview">
			<image :src="url" mode="widthFix"></image>
		</view>
		<!-- 分享给好友 -->
		<button open-type="share">分享好友</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/erweima.jpg"
		}
	},
	onShareAppMessage(e){
		console.log(`pages/Login/Login?token=${uni.getStorageSync('token')}`)
		return {
			title: "Aha口袋",
			path: `pages/Login/Login?token=${uni.getStorageSync('token')}`,
			desc: `${getApp().globalData.gUserInfo.userInfo.nickname}邀您加入Aha口袋`,
			imageUrl: this.url
		}
	},
	methods: {
		preview()
		{
			uni.previewImage({
				urls: [this.url]
			})
		}
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
		overflow hidden
</style>
