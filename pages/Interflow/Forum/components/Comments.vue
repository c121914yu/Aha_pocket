<template>
	<view class="comments">
		<view id="comment-title" class="title">
			<view>
				<text class="label">{{loadBy.label}}</text>
				<text v-if="commentNum>0" class="amount">({{commentNum}})</text>
			</view>
			<text class="iconfont" :class="loadBy.icon" @click="changeCommentSort(null)"></text>
		</view>
		<!-- 评论列表 -->
		<comment-card
			v-for="(comment,i) in arr_comments"
			:key="i"
			:comment="comment"
			@deleteComment="deleteComment(i)"
			@onclickLike="arr_comments[i].isLike=$event.isLike;arr_comments[i].likes=$event.likes"
			@reply="$emit('startReplyComment',{commentId: comment.id,userInfo: comment.userInfo})"
			@showReply="obj_replyComment=comment">
		</comment-card>
		<!-- 无评论提示 -->
		<view v-if="arr_comments.length===0" class="center no-comment" @click="$emit('startWriteComment')">
			暂无评论,点击抢楼!
		</view>
		<view v-else class="center remark">
			{{is_loadAllComment ? "已加载全部评论" : ""}}
		</view>
		<!-- 所有回复弹窗 -->
		<all-reply
			ref="AllReply"
			v-if="obj_replyComment"
			:comment="obj_replyComment"
			@close="obj_replyComment=null"
			@deleteComment="deleteComment"
			@updateComment="updateComment"
			@replyComment="$emit('startReplyComment',{commentId: obj_replyComment.id,userInfo: obj_replyComment.userInfo})"
			@replyOtherReply="$emit('startReplyOtherReply',$event)">
		</all-reply>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscComments,getComment } from "@/static/request/api_forum.js"
import CommentCard from "./CommentCard.vue"
import AllReply from "./AllReply.vue"
export default {
	components: {
		"comment-card": CommentCard,
		"all-reply": AllReply
	},
	props: {
		postId: {
			type: String,
			default: null
		},
		commentNum: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			/* 加载评论 */
			arr_loadBy: [
				{label:"最新评论",value: "latest",icon: "icon-time-sort"},
				{label:"最热评论",value: "hottest",icon: "icon-like-sort"}
			],
			loadBy: {label:"最热评论",value: "hottest",icon: "icon-like-sort"},
			pageNum: 1,
			pageSize: 8,
			is_loadAllComment: true,
			arr_comments: [],
			/* 展示回复的评论 */
			obj_replyComment: null
		}
	},
	created() {
		this.loadComment(true,true)
	},
	methods: {
		/**
		 * 加载单条评论内容
		 */
		loadSingleComment(id)
		{
			getComment(id)
			.then(res => {
				this.obj_replyComment = res.data
			})
		},
		/**
		 * 加载评论
		 * @param {String}  loadBy 排序方式
		 */
		loadComment(init=false,loading=false,loadBy="hottest")
		{
			if(init) {
				this.pageNum = 0
				this.is_loadAll = false
			}
			if(this.is_loadAll) {
				return
			}
			this.is_loadAll = true
			this.gLoading(this,loading)
			getDiscComments({
				postId: this.postId,
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				loadBy
			})
			.then(res => {
				if(init) {
					this.arr_comments = []
				}
				this.arr_comments = this.arr_comments.concat(res.data.pageData)
				if(res.data.pageData.length < this.pageSize){
					this.is_loadAll = true
				}
				else {
					this.pageNum++
					this.is_loadAll = false
				}
				console.log(this.arr_comments);
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 改变评论排序，并重新加载评论。
		 * 如果参数不为空，则切换到参数指定的排序方式。反之在最新和最热之间切换
		 * @param {String} loadBy 排序方式 
		 */
		changeCommentSort(loadBy)
		{
			if(loadBy) {
				this.loadBy = this.arr_loadBy.find(item => item.value === loadBy)
			}
			else {
				/* 最新切换到最热 */
				if(this.loadBy.value === "latest") {
					this.loadBy = this.arr_loadBy[1]
				}
				else {
					this.loadBy = this.arr_loadBy[0]
				}
			}
			this.loadComment(true,true,this.loadBy.value)
		},
		/**
		 * 删除评论,更新commentNum
		 */
		deleteComment(i)
		{
			this.arr_comments.splice(i,1)
			this.obj_replyComment = null
			this.$emit("update:commentNum",this.commentNum-1)
		},
		/**
		 * 全部回复弹窗，点赞评论或者删除评论时触发。
		 * 更新评论的点赞数，点赞状态，回复数。
		 * 并重新赋值给查看回复的评论对象
		 */
		updateComment(e)
		{
			console.log(e);
			const i = this.arr_comments.findIndex(item => item.id === e.commentId)
			this.arr_comments[i].likes = e.likes
			this.arr_comments[i].isLike = e.isLike
			this.arr_comments[i].replyNum = e.replyNum
			this.obj_replyComment = this.arr_comments[i]
		},
		/**
		 * 回复成功
		 * 如果打开了回复弹窗，根据时间优先重新获取回复
		 * 不管是否打开回复弹窗，都给回复弹窗对象赋值该回复，没打开的变打开，打开的刷新。
		 */
		replySuccess(commentId)
		{
			const i = this.arr_comments.findIndex(item => item.id === commentId)
			this.arr_comments[i].replyNum++
			if(this.obj_replyComment) {
				this.$refs["AllReply"].loadReply(true,true,"latest")
			}
			this.obj_replyComment = this.arr_comments[i]
		}
	}
}
</script>

<style lang="stylus" scoped>
.comments
	background-color #FFFFFF
	padding 0 5px
	.title
		padding 10px
		display  flex
		justify-content space-between
		.label
			font-size 30rpx
			font-weight 700
			color var(--black)
			font-style oblique
		.amount
			margin-left 10px
		.iconfont
			font-size 40rpx
			color var(--gray1)
	.no-comment
		padding 10px
		color var(--origin1)
	.remark
		padding 10px
		color var(--gray2)
</style>
