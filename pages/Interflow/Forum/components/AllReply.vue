<!-- 
	所有回复
	author yjl
 -->
<template>
	<view class="all-reply" @touchmove.stop>
		<view class="mask" @click="$emit('close')"></view>
		<view class="container">
			<view class="head">
				<text class="close iconfont icon-jia" @click="$emit('close')"></text>
				<view class="title center">全部回复</view>
			</view>
			<!-- 评论内容 -->
			<comment-card
				:comment="comment"
				:is_showReply="false"
				@deleteComment="$emit('deleteComment',comment)"
				@onclickLike="$emit('updateComment',$event)"
				@reply="$emit('replyComment')">
			</comment-card>
			<!-- 回复内容 -->
			<scroll-view 
				class="replies" 
				scroll-y="scroll-y"
				lower-threshold="150"
				@scrolltolower="loadReply()">
				<view class="remark">全部回复 {{comment.replyNum}}</view>
				<!-- 评论卡片 -->
				<view 
					class="reply"
					v-for="(reply,i) in arr_replies"
					:key="i">
					<navigator
						class="avatar"
						:url="`/pages/Self/UserHome?userId=${reply.userInfo.userId}`">
						<image class="img" :src="reply.userInfo.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></image>
					</navigator>
					<view class="right">
						<view class="user">
							<!-- 昵称 -->
							<view class="name">{{reply.userInfo.nickname}}</view>
							<!-- 点赞 -->
							<view  
								v-if="reply.isLike" 
								class="like red"
								@click="onclickLikeReply(reply,i)">
								<text class="iconfont icon-dianzan_active"></text>{{reply.likes}}
							</view>
							<view 
								v-else class="like"
								@click="onclickLikeReply(reply,i)">
								<text class="iconfont icon-zan"></text>{{reply.likes}}
							</view>
						</view>
						<!-- 回复内容 -->
						<view class="content" @click="replyOtherReply(reply)">{{reply.content}}</view>
						<!-- 底部，评论时间，回复，操作图标 -->
						<view class="footer">
							<view class="time">{{gformatDate(reply.createTime)}}</view>
							<view class="reply-btn" @click="replyOtherReply(reply)">回复</view>
							<view class="blank"></view>
							<view style="font-size: 36rpx;" class="iconfont icon-xinxi" @click="onclickControl(i)"></view>
						</view>
					</view>
				</view>
				<view 
					v-if="arr_replies.length > 0"
					style="color: var(--gray2);"
					class="center">
					{{is_loadAll ? "已加载全部" : ""}}
				</view>
			</scroll-view>
			<view class="reply-comment" @click="$emit('replyComment')">
				回复作者...
			</view>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscCommentsReply,likeDiscCommentReply,deleteDiscCommentReply } from "@/static/request/api_forum.js"
import CommentCard from "./CommentCard.vue"
export default {
	components: {
		"comment-card": CommentCard
	},
	props: {
		comment: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			pageNum: 0,
			pageSize: 8,
			is_loadAll: false,
			arr_replies: []
		}
	},
	created() {
		this.loadReply(true)
	},
	methods: {
		/**
		 * 加载评论
		 * @param {String}  loadBy 排序方式
		 */
		loadReply(init=false,loading=false,loadBy="hottest")
		{
			if(init) {
				this.paegNum = 0
				this.is_loadAll = false
			}
			if(this.is_loadAll) {
				return
			}
			this.gLoading(this,loading)
			getDiscCommentsReply({
				commentId: this.comment.id,
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				loadBy
			})
			.then(res => {
				if(init) {
					this.arr_replies = []
				}
				this.arr_replies = this.arr_replies.concat(res.data.pageData)
				if(res.data.pageData.length < this.pageSize) {
					this.is_loadAll = true
				}
				else {
					this.pageNum++
				}
				console.log("回复",this.arr_replies);
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 打开menu操作面板，复制内容,回复,查看用户
		 */
		onclickControl(i)
		{
			const reply = this.arr_replies[i]
			const list = ["复制","回复","查看用户"]
			if(reply.uid === getApp().globalData.gUserInfo.userInfo.userId){
				list.push("删除回复")
			}
			this.gMenuPicker(list)
			.then(res => {
				switch(res) {
					case "复制":
						this.gClipboardData(reply.content,"已复制")
						break
					case "回复":
						this.$emit("reply")
						break
					case "查看用户":
						uni.navigateTo({
							url: `/pages/Self/UserHome?userId=${reply.uid}`
						})
						break
					case "删除回复":
						this.gShowModal("确认删除回复?",() => {
							deleteDiscCommentReply(reply.id)
							this.arr_replies.splice(i,1)
							/* 更新该评论的部分数据 */
							this.$emit("updateComment",{
								commentId: reply.commentId,
								likes: this.comment.likes,
								isLike: this.comment.isLike,
								replyNum: this.comment.replyNum-1
							})
						})
						break
				}
			})
		},
		/**
		 * 点赞回复,更新like状态
		 */
		onclickLikeReply(reply,i)
		{
			likeDiscCommentReply(reply.id,!reply.isLike)
			this.arr_replies[i].isLike = !this.arr_replies[i].isLike
			this.arr_replies[i].likes = this.arr_replies[i].isLike ? this.arr_replies[i].likes+1 : this.arr_replies[i].likes-1
			if(this.arr_replies[i].isLike) {
				uni.vibrateShort()
			}
		},
		/**
		 * 回复其他回复
		 * 调用父级方法，再通过父级传到祖先级调用输入弹窗。
		 */
		replyOtherReply(reply)
		{
			this.$emit("replyOtherReply",{
				commentId: reply.commentId,
				toUserId: reply.uid,
				userInfo: reply.userInfo
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.all-reply
	z-index 5
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	.mask
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		background-color rgba(0,0,0,0.1)
	.container
		position absolute
		bottom 0
		width 100%
		height 0
		padding 10px
		animation .3s show forwards
		border-top-left-radius 22px
		border-top-right-radius 22px
		background-color #FFFFFF
		display flex
		flex-direction column
		/* 关闭图标 & 回复数量提示 */
		.head
			position relative
			.title
				font-size 28rpx
			.close
				position absolute
				left 10px
				top 0
				transform rotate(45deg)
				font-size 35rpx
		.replies
			margin 10px 0
			flex 1
			overflow auto
			.remark
				padding 0 10px
				color var(--black)
				font-weight 700
			.red
				color #f54d2c !important
			/* 回复卡片内容 */
			.reply
				padding 10px 15px
				display flex
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
					.user
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
					.footer
						font-size 22rpx
						display flex
						align-items center
						.time
							color var(--gray2)
						.reply-btn
							margin-left 10px
							color var(--gray2)
		.reply-comment
			padding 5px 10px
			font-size 24rpx
			background-color var(--white1)
			border-radius 8px
@keyframes show
	to
		height 90vh
</style>
