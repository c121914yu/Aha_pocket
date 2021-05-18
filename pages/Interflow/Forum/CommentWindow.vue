<!-- 
	评论弹窗
	author yjl
 -->
<template>
	<view class="comments-window">
		<view v-if="arr_comments.length===0" class="no-comment" @click="is_writing=true">
			还没有人评论,快来抢占位置吧!
		</view>
		<view class="comments">
			<comment-card
				v-for="(comment,i) in arr_comments"
				:key="comment.id"
				:comment="comment"
				is_showReply="is_showReply"
				@onclickLike="arr_comments[i].isLike=$event.isLike;arr_comments[i].likes=$event.likes"
				@reply="writeReply"
				@deleteComment="deleteComment">
			</comment-card>
			<view v-if="arr_comments.length > 0" class="center remark">{{is_loadAll ? "已加载全部" : ""}}</view>
		</view>
		<view class="write">
			<!-- 蒙层 -->
			<view 
				v-show="is_writing" 
				class="mask" 
				@touchstart="closeInput">
			</view>
			<view class="write-textarea" v-show="is_writing">
				<textarea
					:focus="is_writing" 
					:placeholder="obj_replyObj ? obj_replyObj.placeholder : '写评论...'"
					auto-height="auto-height"
					maxlength="-1"
					cursor-spacing="120"
					:show-confirm-bar="false"
					v-model="content"/>
				<view class="footer">
					<view></view>
					<button @click="onclickSend">发送</button>
				</view>
			</view>
			<view v-show="!is_writing" class="hint" @click="is_writing=true">写评论...</view>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscComments,getDiscCommentsReply,postDiscComment,postDiscCommentReply } from "@/static/request/api_forum.js"
import CommentCard from "./components/CommentCard.vue"
export default {
	components: {
		"comment-card": CommentCard
	},
	props: {
		is_showCommentWindow: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			postId: "",
			is_writing: false, // 是否正在写评论
			obj_replyObj: null, // 点击评论，记录对应需要回复的评论
			content: "", // 文本
			pageNum: 0,
			pageSize: 10,
			is_loadAll: false,
			arr_comments: []
		}
	},
	onLoad(e) {
		this.postId = e.id
		this.is_writing = e.focus === "1"
		if(e.reply) {
			this.writeReply(JSON.parse(e.reply))
		}
		this.loadComment(true,true)
	},
	onReachBottom() {
		if(!this.is_loadAll) {
			this.loadComment()
		}
	},
	methods: {
		/**
		 * 加载评论
		 */
		loadComment(init=false,loading=false)
		{
			this.gLoading(this,loading)
			if(init) {
				this.pageNum = 0
			}
			getDiscComments({
				postId: this.postId,
				pageNum: this.pageNum,
				pageSize: this.pageSize
			})
			.then(res => {
				if(res.data.pageData.length < this.pageSize){
					this.is_loadAll = true
				}
				else {
					this.pageNum++
				}
				if(init) {
					this.arr_comments = []
				}
				this.arr_comments = this.arr_comments.concat(res.data.pageData)
				console.log(this.arr_comments);
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 点击评论和回复，触发回复写入
		 */
		writeReply(item)
		{
			/* 如果有toUserInfo说明是回复 回复内容 */
			if(item.toUserInfo) {
				this.obj_replyObj = {
					isReply: true,
					userId: item.toUserInfo.userId,
					placeholder: `回复${item.toUserInfo.nickname}的回复：`,
					commentId: item.commentId
				}
			}
			else {
				this.obj_replyObj = {
					isReply: false,
					userId: item.userInfo.userId,
					placeholder: `回复${item.userInfo.nickname}：`,
					commentId: item.id
				}
			}
			this.is_writing = true
		},
		/**
		 * 关闭输入
		 */
		closeInput()
		{
			this.is_writing = false
			this.obj_replyObj = null
		},
		/**
		 * 删除评论
		 */
		deleteComment(id)
		{
			const index = this.arr_comments.findIndex(item => item.id === id)
			this.arr_comments.splice(index,1)
		},
		/**
		 * 点击发送按键,判断是回复还是
		 */
		onclickSend()
		{
			if(!this.content) {
				this.gToastMsg("评论内容不能为空")
			}
			/* 回复 */
			else if(this.obj_replyObj) {
				postDiscCommentReply({
					toId: this.obj_replyObj.userId,
					commentId: this.obj_replyObj.commentId,
					content: this.content
				})
				.then(res => {
					this.content = ""
					this.is_writing = false
					this.obj_replyObj = null
					this.gToastMsg("回复成功!")
					console.log(res);
				})
			}
			/* 评论 */
			else {
				postDiscComment({
					postId: this.postId,
					content: this.content
				})
				.then(res => {
					this.content = ""
					this.is_writing = false
					this.gToastMsg("评论成功!")
					console.log(res);
				})
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.comments-window
	min-height 100vh
	padding-bottom 60px
	.no-comment
		position absolute
		top 45%
		left 50%
		transform translate(-50%,-100%)
		color var(--origin1)
	.remark
		margin 10px 0
		color var(--gray2)
	.write
		position fixed
		bottom 0
		width 100%
		background-color #FFFFFF
		.mask
			position fixed
			top 0
			left 0
			right 0
			bottom 0
			background-color rgba(0,0,0,0.1)
		.hint
			margin 10px
			padding 10px
			border-radius 8px
			background-color var(--white1)
		.write-textarea
			position relative
			padding 10px
			background-color #FFFFFF
			textarea
				width 100%
				min-height 65px
				max-height 150px
				border-radius 8px
				padding 5px
				background-color var(--white1)
		.footer 
			position relative
			background-color #FFFFFF
			display flex
			justify-content space-between
			button
				margin 5px 0 0 0
				line-height 1.4
				width 60px
				border-radius 22px
</style>
