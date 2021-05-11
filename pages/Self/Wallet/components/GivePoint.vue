<!-- 
	转赠Aha币弹窗
	author yjl
-->
<template>
	<view class="give-point fix-screen">
		<view class="content">
			<view class="search">
				<text class="iconfont icon-sousuo"></text>
				<input type="text" placeholder="根据userId搜索用户" v-model="userId"/>
				<text class="search-btn" @click="onclickSearch">搜索</text>
			</view>
			<view v-if="obj_userInfo" class="userInfo">
				<view class="center h3">用户信息</view>
				<image :src="obj_userInfo.avatarUrl"></image>
				<view class="item userId">
					<text class="label">userId:</text>
					<text class="value">{{obj_userInfo.userId}}</text>
				</view>
				<view class="item name">
					<text class="label">昵&emsp;称:</text>
					<text class="value">{{obj_userInfo.nickname}}</text>
				</view>
				<view class="item">
					<text class="label">转赠数量:</text>
					<input type="number" :max="canGivePoint" placeholder="需要转赠的贡献点" v-model.number="amountGive">
				</view>
				<view class="item">
					<text class="label">可转赠:</text>
					<text class="value">{{canGivePoint}}点</text>
				</view>
			</view>
			<view v-else class="blank"></view>
			<view class="btns">
				<view class="cancel" @click="$emit('close')">取消</view>
				<view class="sure strong" @click="onclickGive">确认</view>
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
			obj_userInfo: null, // 用户信息
			canGivePoint: Math.floor(getApp().globalData.gUserInfo.contribPoint * 0.7), // 可以赠送多少点
			amountGive: "", // 赠送数量
		}
	},
	methods: {
		/**
		 * 点击搜索，触发用户搜索
		 */
		onclickSearch()
		{
			if(this.userId){
				getUser(this.userId)
				.then(res => {
					console.log(res.data);
					this.obj_userInfo = res.data
					if(!this.obj_userInfo){
						this.gToastError("用户不存在")
					}
					else{
						this.userId = ""
					}
				})
			}
		},
		/**
		 * 点击确认，检测输入值是否大于最大值
		 */
		onclickGive()
		{
			if(this.amountGive > 0){
				if(this.amountGive > this.canGivePoint){
					this.gToastError("超出转赠数量")
				}
				else{
					this.gShowModal(`你即将转赠 ${this.amountGive} 个贡献点给 ${this.obj_userInfo.nickname},请确认操作！`,() => {
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
