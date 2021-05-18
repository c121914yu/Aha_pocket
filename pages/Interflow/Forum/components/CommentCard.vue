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
			<view class="head" @longpress="onlongpress">
				<view class="name">
					{{comment.userInfo.nickname}}
				</view>
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
			<view @click="$emit('reply',comment)" @longpress="onlongpress">
				<text class="content">{{comment.content}}</text>
				<text class="time">{{gformatDate(comment.createTime)}}</text>
			</view>
			<!-- 回复 -->
			<view v-if="is_showReply" class="replies">
				<reply-card 
					v-for="(reply,index) in arr_replies"
					:key="reply.id"
					:reply="reply"
					@onclickLike="onclickLikeReply(reply,index)"
					@reply="$emit('reply',reply)"
					@deleteReply="deleteReply">
				</reply-card>
				<!-- 查看更多回复 -->
				<view 
					v-if="arr_replies.length < comment.replyNum" 
					class="read-more center" 
					@click="loadReply">
					查看更多回复
				</view>
			</view>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscCommentsReply,likeDiscComment,likeDiscCommentReply,deleteDiscComment } from "@/static/request/api_forum.js"
import ReplyCard from "./ReplyCard.vue"
export default {
	components: {
		"reply-card": ReplyCard
	},
	props: {
		comment: {
			type: Object,
			default: () => {}
		},
		is_showReply: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			pageNum: 0,
			pageSize: 5,
			arr_replies: [],
			replyNum: 0
		}
	},
	created() {
		this.arr_replies = this.comment.replies.pageData
		this.replyNum = this.comment.replyNum
	},
	methods: {
		/**
		 * 加载评论
		 */
		loadReply()
		{
			this.gLoading(this,true)
			getDiscCommentsReply({
				commentId: this.comment.id,
				pageNum: this.pageNum,
				pageSize: this.pageSize
			})
			.then(res => {
				/* 第一次点击的话，删除原来的评论 */
				if(this.arr_replies.length < this.pageSize) {
					this.arr_replies = []
				}
				this.arr_replies = this.arr_replies.concat(res.data.pageData)
				if(res.data.pageData.length === this.pageSize) {
					this.pageNum++
				}
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 长按提示复制内容,回复,查看用户
		 */
		onlongpress()
		{
			if(!this.is_showReply){
				return
			}
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
						this.$emit("reply",this.comment)
						break
					case "查看用户":
						uni.navigateTo({
							url: `/pages/Self/UserHome?userId=${this.comment.uid}`
						})
						break
					case "删除评论":
						this.gShowModal("确认删除评论?",() => {
							deleteDiscComment(this.comment.id)
							this.$emit("deleteComment",this.comment.id)
						})
						break
				}
			})
		},
		/**
		 * 删除回复
		 * @param {String} id 回复id
		 */
		deleteReply(id)
		{
			const index = this.arr_replies.findIndex(item => item.id === id)
			this.arr_replies.splice(index,1)
			this.comment.replyNum--
		},
		/**
		 * 点赞 / 取消点赞评论
		 */
		onclickLike()
		{
			likeDiscComment(this.comment.id,!this.comment.isLike)
			this.$emit("onclickLike",{
				isLike: !this.comment.isLike,
				likes: !this.comment.isLike ? this.comment.likes+1 : this.comment.likes-1
			})
			if(!this.comment.isLike) {
				uni.vibrateShort()
			}
		},
		/**
		 * 点赞 / 取消点赞回复
		 */
		onclickLikeReply(reply,index)
		{
			likeDiscCommentReply(reply.id,!reply.isLike)
			this.arr_replies[index].likes = !this.arr_replies[index].isLike ? this.arr_replies[index].likes+1 : this.arr_replies[index].likes-1
			this.arr_replies[index].isLike = !this.arr_replies[index].isLike
			if(this.arr_replies[index].isLike) {
				uni.vibrateShort()
			}
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
				.remove
					color var(--gray2)
					font-size 24rpx
			.like
				font-size 24rpx
				color var(--gray2)
				.iconfont
					margin-right 2px
		.content
			padding 5px 0
			color var(--black)
			font-weight 700
			font-size 28rpx
		.time
			font-size 18rpx
			color var(--gray2)
			margin-left 5px
		/* 查看更多回复 */
		.read-more
			margin-left -40px
			padding 5px
			color var(--origin1)
			font-size 24rpx
</style>
