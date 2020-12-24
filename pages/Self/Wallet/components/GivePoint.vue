<!-- 转赠贡献度 -->
<template>
	<view class="give-point fix-screen">
		<view class="content">
			<view class="search">
				<text class="iconfont icon-sousuo"></text>
				<input type="text" placeholder="根据userId搜索用户" v-model="userId"/>
				<text class="search-btn" @click="searchUser">搜索</text>
			</view>
			<view v-if="userCard" class="userInfo">
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
			</view>
			<view v-else class="blank"></view>
			<view class="btns">
				<view class="cancel" @click="$emit('close')">取消</view>
				<view class="sure strong" @click="sure">确认</view>
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
			if(this.userId === ""){
				return
			}
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
						this.gToastSuccess("转赠成功")
						this.$emit("success")
					})
				}
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.give-point
	/* 用户信息卡片 */
	.content
		width 90%
		min-height 200px
		border-radius 8px
		display flex
		flex-direction column
		.search
			position relative
			display flex
			align-items center
			.icon-sousuo
				position absolute
				margin-left 7px
				color var(--gray1)
			input
				flex 1
				padding-left 30px
				border var(--border2)
			.search-btn
				margin-left 10px
				color var(--origin2)
		.blank
			flex 1
		/* 用户信息 */
		.userInfo
			margin-top 5px
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
			display flex
			align-items center
			.cancel
				width 50%
				color var(--gray1)
				border-right 2px solid var(--origin2)
			.sure
				width 50%
				color var(--origin1)
</style>
