<!-- 
	我的互动
	author yjl
-->
<template>
	<view class="my-interaction">
		<view 
			class="item"
			v-for="item in arr_interactions"
			:key="item.id">
			<navigator 
				hover-class="none"
				class="author" 
				:url="`/pages/Self/UserHome?userId=${item.uid}`">
				<aha-avatar 
					:src="item.userInfo.avatarUrl" 
					radius="radius"
					size="30">
				</aha-avatar>
				<view class="nickname">{{item.userInfo.nickname}}</view>
			</navigator>
			<view class="container">
				<view class="content">
					回复
					<navigator
						v-if="item.toUserInfo"
						hover-class="none"
						class="reply" 
						:url="`/pages/Self/UserHome?userId=${item.toUserInfo.userId}`">
						{{item.toUserInfo.nickname}}
					</navigator>
					: {{item.content}}
				</view>
				<!-- 帖子标题 -->
				<navigator 
					hover-class="none"
					class="forum" 
					:url="`ForumDetail?id=${item.pid}&commentId=${item.commentId}`">
					{{item.replyContent}}
				</navigator>
				<!-- 时间和点赞 -->
				<view class="data">
					{{gformatDate(item.createTime)}} - {{item.likes}}点赞
				</view>
			</view>
		</view>
		<view class="center remark">
			{{obj_loadComments.is_loadAll ? "已加载全部" : ""}}
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getUserComments,getMyReply } from "@/static/request/api_forum.js"
export default {
	data() {
		return {
			obj_loadComments: {
				pageNum: 0,
				pageSize: 10,
				is_loadAll: false
			},
			obj_loadReplies: {
				pageNum: 0,
				pageSize: 10,
				is_loadAll: false
			},
			arr_interactions: [],
			userId: getApp().globalData.gUserInfo.userInfo.userId
		}
	},
	onLoad() {
		this.loadData(true,true)
	},
	onReachBottom() {
		this.loadData()
	},
	methods: {
		/**
		 * 获取评论,回复数据
		 */
		loadData(init=false,loading=false)
		{
			this.gLoading(this,loading)
			if(init) {
				this.obj_loadComments = {
					pageNum: 0,
					pageSize: 10,
					is_loadAll: false
				}
				this.obj_loadReplies = {
					pageNum: 0,
					pageSize: 10,
					is_loadAll: false
				}
			}
			if(this.obj_loadComments.is_loadAll && this.obj_loadReplies.is_loadAll) {
				return
			}
			Promise.all([
				getUserComments({
					pageNum: this.obj_loadComments.pageNum,
					pageSize: this.obj_loadComments.pageSize,
					userId: this.userId
				}),
				getMyReply({
					pageNum: this.obj_loadReplies.pageNum,
					pageSize: this.obj_loadReplies.pageSize,
					userId: this.userId
				}),
			])
			.then(res => {
				let data = JSON.parse(JSON.stringify(this.arr_interactions))
				if(init) {
					data = []
				}
				console.log(res);
				const comments = res[0].data
				const replies = res[1].data
				comments.pageData.forEach(item => {
					data.push({
						...item.comment,
						commentId: item.comment.id,
						replyContent: item.postTitle,
					})
				})
				replies.pageData.forEach(item => {
					data.push({
						...item.reply,
						replyContent: item.commentContent,
						pid: item.postId,
					})
				})
				data.sort((a,b) => new Date(b.createTime) - new Date(a.createTime))
				this.arr_interactions = data
				if(comments.pageData.length < this.obj_loadComments.pageSize) {
					this.obj_loadComments.is_loadAll = true
				}
				else {
					this.obj_loadComments.pageNum++
				}
				if(replies.pageData.length < this.obj_loadReplies.pageSize) {
					this.obj_loadReplies.is_loadAll = true
				}
				else {
					this.obj_loadReplies.pageNum++
				}
				console.log(this.arr_interactions);
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 加载回复
		 */
		loadReply(init=false,loading=false)
		{
			this.gLoading(this,loading)
			if(init) {
				this.obj_loadComments = {
					pageNum: 0,
					pageSize: 10,
					is_loadAll: false
				}
			}
			this.obj_loadReplies = {
				pageNum: 0,
				pageSize: 10,
				is_loadAll: false
			}
			if(this.is_loadAll) {
				return
			}
			getUserComments({
				pageNum: this.obj_loadComments.pageNum,
				pageSize: this.obj_loadComments.pageSize,
				userId: this.userId
			})
			.then(res => {
				if(init) {
					this.arr_interactions = []
				}
				this.arr_interactions = this.arr_interactions.concat(res.data.pageData)
				if(res.data.pageData.length < this.pageSize) {
					this.is_loadAll = true
				}
				else {
					this.pageNum++
				}
				console.log(this.arr_interactions);
			})
			.finally(() => this.gLoading(this,false))
		},
	}
}
</script>

<style lang="stylus" scoped>
.my-interaction
	.item
		padding 10px
		border-bottom var(--border2)
		.author
			display flex
			align-items center
			.nickname
				margin-left 10px
				display inline-block
		.container
			margin-left 40px
			display block
		.content
			font-size 28rpx
			.reply
				margin-left 5px
				color var(--origin1)
		.forum
			margin 5px 0
			padding 10px
			border-radius 8px
			font-size 22rpx
			color var(--gray2)
			background-color rgba(225, 225, 226, 0.5)
			display block
		.data
			font-size 20rpx
			color var(--gray2)
	.remark
		padding 10px
		color var(--gray2)
</style>
