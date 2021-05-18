<!-- 
	回复卡片
	author yjl
 -->
<template>
	<view class="reply-card">
		<navigator
			class="avatar"
			:url="`/pages/Self/UserHome?userId=${reply.userInfo.userId}`">
			<image class="img" :src="reply.userInfo.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></image>
		</navigator>
		<view class="right">
			<view class="head" @longpress="onlongpress">
				<view class="name">{{reply.userInfo.nickname}}</view>
				<view  
					v-if="reply.isLike" 
					class="like red"
					@click="$emit('onclickLike')">
					<text class="iconfont icon-dianzan_active"></text>{{reply.likes}}
				</view>
				<view 
					v-else class="like"
					@click="$emit('onclickLike')">
					<text class="iconfont icon-zan"></text>{{reply.likes}}
				</view>
			</view>
			<view @click="$emit('reply')" @longpress="onlongpress">
				<text class="content"><text class="remark">回复{{reply.toUserInfo.nickname}}:</text>{{reply.content}}</text>
				<text class="time">{{gformatDate(reply.createTime)}}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { deleteDiscCommentReply } from "@/static/request/api_forum.js"
export default {
	props: {
		reply: {
			type: Object,
			default: () => {}
		}
	},
	methods: {
		/**
		 * 长按提示复制内容,回复,查看用户
		 */
		onlongpress()
		{
			const list = ["复制","回复","查看用户"]
			if(this.reply.uid === getApp().globalData.gUserInfo.userInfo.userId){
				list.push("删除回复")
			}
			this.gMenuPicker(list)
			.then(res => {
				switch(res) {
					case "复制":
						this.gClipboardData(this.reply.content,"已复制")
						break
					case "回复":
						this.$emit("reply")
						break
					case "查看用户":
						uni.navigateTo({
							url: `/pages/Self/UserHome?userId=${this.reply.uid}`
						})
						break
					case "删除回复":
						console.log(this.reply);
						this.gShowModal("确认删除回复?",() => {
							deleteDiscCommentReply(this.reply.id)
							this.$emit("deleteReply",this.reply.id)
						})
						break
				}
			})
		},
	}
}
</script>

<style lang="stylus" scoped>
.reply-card
	margin 10px 0
	display flex
	.red
		color #f54d2c !important
	.avatar
		width 25px
		height 25px
		border-radius 50%
		padding 3px
		background-color var(--origin3)
		.img
			width 100%
			height 100%
			border-radius 50%
	.right
		flex 1
		margin-left 10px
		.head
			display flex
			justify-content space-between
			.name
				color var(--black)
			.like
				font-size 24rpx
				color var(--gray2)
				.iconfont
					margin-right 2px
		.content
			margin 5px 0
			color var(--black)
			font-weight 500
			font-size 28rpx
			.remark
				margin-right 4px
				color var(--gray2)
		.time
			font-size 18rpx
			color var(--gray2)
			margin-left 5px
</style>
