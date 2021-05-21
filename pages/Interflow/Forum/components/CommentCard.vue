<!-- 
	评论卡片
	author yjl
 -->
<template>
	<view class="comment-card">
		<navigator 
			class="avatar"
			:url="`/pages/Self/UserHome?userId=${comment.userInfo.userId}`">
			<image class="img" :src="comment.userInfo.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></image>
		</navigator>
		<view class="right">
			<view class="head">
				<!-- 昵称 -->
				<view class="name">
					{{comment.userInfo.nickname}}
				</view>
				<!-- 点赞 -->
				<view  
					v-if="comment.isLike" 
					class="like red"
					@click="onclickLike">
					<text class="iconfont icon-dianzan_active"></text>{{comment.likes}}
				</view>
				<view 
					v-else class="like"
					@click="onclickLike">
					<text class="iconfont icon-zan"></text>{{comment.likes}}
				</view>
			</view>
			<!-- 评论内容 -->
			<view class="content" @click="$emit('reply')">{{comment.content}}</view>
			<!-- 底部，评论时间，回复数量，操作图标 -->
			<view class="footer">
				<view class="time">{{gformatDate(comment.createTime)}}</view>
				<view 
					v-if="comment.replyNum>0 && is_showReply" 
					class="reply-num"
					@click="$emit('showReply')">
					{{comment.replyNum}}回复
				</view>
				<view class="blank"></view>
				<view style="font-size: 36rpx;" class="iconfont icon-xinxi" @click="onclickControl"></view>
			</view>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscCommentsReply,likeDiscComment,deleteDiscComment } from "@/static/request/api_forum.js"
export default {
	props: {
		comment: {
			type: Object,
			default: () => {}
		},
		is_showReply: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		/**
		 * 点赞 / 取消点赞评论
		 * 触发父级点赞事件
		 */
		onclickLike()
		{
			likeDiscComment(this.comment.id,!this.comment.isLike)
			this.$emit("onclickLike",{
				isLike: !this.comment.isLike,
				likes: !this.comment.isLike ? this.comment.likes+1 : this.comment.likes-1,
				replyNum: this.comment.replyNum,
				commentId: this.comment.id
			})
			if(!this.comment.isLike) {
				uni.vibrateShort()
			}
		},
		/**
		 * 打开menu操作面板，复制内容,回复,查看用户
		 */
		onclickControl()
		{
			const list = ["复制","回复","查看用户"]
			if(this.comment.uid === getApp().globalData.gUserInfo.userInfo.userId){
				list.push("删除评论")
			}
			this.gMenuPicker(list)
			.then(res => {
				switch(res) {
					case "复制":
						this.gClipboardData(this.comment.content,"已复制")
						break
					case "回复":
						this.$emit("reply")
						break
					case "查看用户":
						uni.navigateTo({
							url: `/pages/Self/UserHome?userId=${this.comment.uid}`
						})
						break
					case "删除评论":
						this.gShowModal("确认删除评论?",() => {
							deleteDiscComment(this.comment.id)
							this.$emit("deleteComment")
						})
						break
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.comment-card
	padding 12px
	display flex
	border-bottom var(--border2)
	.red
		color #f54d2c !important
	.avatar
		width 30px
		height 30px
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
				font-size 24rpx
			.like
				color var(--gray2)
				.iconfont
					margin-right 2px
					font-size 30rpx
		.content
			padding 5px 0
			color var(--black)
			font-size 28rpx
		.footer
			font-size 24rpx
			display flex
			align-items flex-start
			.time
				color var(--gray2)
			.reply-num
				margin-left 10px
				padding 2px 10px
				border-radius 22px
				background-color var(--origin4)
				color var(--black)
</style>
