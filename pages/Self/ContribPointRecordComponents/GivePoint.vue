<!-- 转赠贡献度 -->
<template>
	<view class="give-point">
		<view class="search">
			<input type="text" placeholder="转增人userId" v-model.number="userId">
			<text @click="searchUser">搜索</text>
		</view>
		<view v-if="userCard" class="user-card">
			<view class="card">
				<view class="center h3">用户信息</view>
				<image :src="userCard.avatarUrl"></image>
				<view class="item userId">
					<text class="label">userId:</text>
					<text class="value">{{userCard.userId}}</text>
				</view>
				<view class="item name">
					<text class="label">昵&emsp;称:</text>
					<text class="value">{{userCard.nickname}}</text>
				</view>
				<view class="item">
					<text class="label">转赠数量:</text>
					<input type="number" :max="canGivePoint" placeholder="需要转赠的贡献点" v-model.number="giveAmount">
				</view>
				<view class="item">
					<text class="label">可转赠:</text>
					<text class="value">{{canGivePoint}}点</text>
				</view>
				<view class="item btns">
					<view class="cancel" @click="userCard=null">取消</view>
					<view class="sure strong" @click="sure">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getUser } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			userId: "",
			userCard: null,
			canGivePoint: Math.floor(getApp().globalData.gUserInfo.contribPoint * 0.7),
			giveAmount: ""
		}
	},
	methods: {
		/* 根据userId搜索用户 */
		searchUser()
		{
			if(this.userId === "")
				return
			getUser(this.userId)
			.then(res => {
				this.userCard = res.data
				console.log(res.data);
				if(!this.userCard){
					this.gToastError("用户不存在")
				}
				else{
					this.userId = ""
				}
			})
		},
		/* 确认转赠，需调用modal提示框再次提示风险.成功后重新请求账单 */
		sure()
		{
			if(this.giveAmount > 0){
				if(this.giveAmount > this.canGivePoint){
					this.gToastError("超出转赠数量")
				}
				else{
					this.gShowModal(`你即将转赠 ${this.giveAmount} 个贡献点给 ${this.userCard.nickname},请确认操作！`,() => {
						console.log("转赠成功");
						this.userCard = null
					})
				}
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.give-point
	margin-top 10px
	padding 0 10px
	.search
		display flex
		align-items center
		input
			flex 1
			border var(--border2)
			padding 0 5px
			border-radius 4px
		text
			margin-left 10px
			color var(--gray1)
	/* 用户信息卡片 */
	.user-card
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		background-color rgba(0,0,0,0.2)
		display flex
		align-items center
		justify-content center
		.card
			width 90%
			padding 10px 20px
			border-radius 8px
			background-color #FFFFFF
			image
				margin auto
				width 60px
				height 60px
				border-radius 50%
				display block
			.item 
				margin 5px 0
				display flex
				align-items center
				.label
					width 70px
					display block
					font-size 26rpx
				.value
					margin-left 5px
					color var(--origin1)
				input
					padding 0 5px
					border-radius 4px
					border var(--border2)
			.btns
				margin-top 10px
				font-size 30rpx
				text-align center
				.cancel
					width 50%
					color var(--gray1)
					border-right 2px solid var(--origin2)
				.sure
					width 50%
					color var(--origin1)
</style>
