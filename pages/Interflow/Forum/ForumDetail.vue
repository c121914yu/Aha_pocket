<!-- 
	讨论详细页面 
	author yjl
-->
<template>
	<view id="forum" class="forum-detail" @touchmove="ontouchMove">
		<!-- 编辑按键 -->
		<navigator 
			v-if="relation===1" 
			class="edit"
			:url="`./Create_EditForum?id=${postId}`">
			编辑<text class="iconfont icon-write"></text>
		</navigator>
		<view class="header">
			<view class="title">{{title}}</view>
			<view class="data">
				<view class="time">{{gformatDate(createTime)}}</view>
				<view class="read">{{read}}次阅读</view>
			</view>
			<view class="author">
				<navigator
					class="avatar"
					:url="`/pages/Self/UserHome?userId=${obj_authorInfo.userId}`">
					<image class="img" :src="obj_authorInfo.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></image>
				</navigator>
				<view class="name">
					{{obj_authorInfo.nickname}}
				</view>
				<view class="level"><aha-user-level :point="authorPoint"></aha-user-level></view>
				<!-- 私信 & 关注按键 -->
				<navigator 
					v-if="relation !== 1"
					hover-class="none"
					:url="`../../Self/Inform/Inform_send?id=${obj_authorInfo.userId}`">
					<button>私信</button>
				</navigator>
				<button 
					v-if="relation !== 1"
					:style="{
						'color': relation === 0 ? 'var(--font-dark)' : 'var(--gray2)'
					}"
					@click="onclickAttention">
					{{relation === 0 ? "关注" : "已关注"}}
				</button>
			</view>
		</view>
		<view class="content">
			<view class="rich-text" v-html="content"></view>
			<!-- 最后更新时间 -->
			<view class="update-time">
				最新更新时间{{updateTime ? gformatDate(updateTime) : gformatDate(createTime)}}
			</view>
			<!-- 点赞 -->
			<view class="like center">
				<text v-if="likes>0">已有{{likes}}人赞...</text>
				<text v-if="is_liked" style="font-size: 40rpx;" class="iconfont icon-dianzan_active red" @click="onclickLike"></text>
				<text v-else style="font-size: 40rpx;" class="iconfont icon-zan" @click="onclickLike"></text>
			</view>
		</view>
		<!-- 推荐文章 -->
		<view class="recommend"></view>
		<!-- 评论区 -->
		<view id="comments" class="comments">
			<comments 
				v-if="postId"
				ref="Comments"
				:postId="postId"
				:commentNum.sync="commentNum"
				@startWriteComment="startWrite(0)"
				@startReplyComment="startWrite(1,$event)"
				@startReplyOtherReply="startWrite(2,$event)">
			</comments>
		</view>
		<!-- 底部导航 -->
		<view class="footer-nav">
			<view class="wtrite-comment" @click="startWrite(0)">
				<text class="iconfont icon-write"></text>写评论...
			</view>
			<view class="ctr" @click="toComment">
				<text class="iconfont icon-pinglun"></text>
				<view class="center">评论</view>
				<view v-if="commentNum>0" class="dot">{{commentNum}}</view>
			</view>
			<view class="ctr" @click="onclickCollect">
				<text v-if="is_collected" class="iconfont icon-collection red"></text>
				<text v-else class="iconfont icon-shoucang"></text>
				<view class="center">收藏</view>
				<view v-if="collections>0" class="dot">{{collections}}</view>
			</view>
			<view class="ctr" @click="onclickLike">
				<text v-if="is_liked" class="iconfont icon-dianzan_active red"></text>
				<text v-else class="iconfont icon-zan"></text>
				<view class="center">点赞</view>
				<view v-if="likes>0" class="dot">{{likes}}</view>
			</view>
			<button class="ctr" open-type="share">
				<text class="iconfont icon-share"></text>
				<view class="center">分享</view>
			</button>
		</view>
		<!-- 写评论 -->
		<write-comment
			v-if="obj_writeContent"
			:postId="postId"
			:placeholder="obj_writeContent.placeholder"
			:commentId="obj_writeContent.commentId"
			:toUserId="obj_writeContent.toUserId"
			@close="obj_writeContent=null"
			@writeFinish="writeFinish">
		</write-comment>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscussion,likeDiscussion,collectDiscussion } from "@/static/request/api_forum.js"
import { getUserRelation,followUser,unfollowUser,getUserStatistice } from '@/static/request/api_userInfo.js'
import Comments from "./components/Comments.vue"
import WriteComment from "./components/WriteComment.vue"
export default {
	components: {
		"comments": Comments,
		"write-comment": WriteComment,
	},
	data() {
		return {
			relation: 0, // 0-无关系 1-自己 2-已关注 3-被关注 4-互关
			postId: "",
			obj_authorInfo: {},
			authorPoint: 0,
			commentNum: 0,
			content: "",
			createTime: new Date(),
			collections: 0,
			is_collected: false,
			likes: 0,
			is_liked: false,
			read: 0,
			title: "讨论题目",
			updateTime: new Date(), //最后更新时间
			/* 评论对象 */
			obj_writeContent: null,
		}
	},
	onLoad(e) {
		this.postId = e.id
		this.gLoading(this,true)
		getDiscussion(this.postId)
		.then(res => {
			if(!res.data) {
				this.gBackPage("帖子无效")
			}
			this.obj_authorInfo = res.data.authorInfo
			this.content = res.data.content
			this.createTime = res.data.createTime
			this.collections = res.data.collections
			this.is_collected = res.data.isCollected
			this.likes = res.data.likes
			this.is_liked = res.data.isLiked
			this.read = res.data.read
			this.title = res.data.title
			this.updateTime = res.data.updateTime
			
			/* 评论数据 */
			this.commentNum = res.data.commentNum
			this.arr_comments = res.data.comments.pageData
			if(this.arr_comments.length < this.pageSize) {
				this.is_loadAllComment = true
			}
			else {
				this.is_loadAllComment = false
			}
			console.log(res.data);
			/* 获取与用户的关系 */
			getUserRelation(this.obj_authorInfo.userId)
			.then(res => {
				this.relation = res.data
			})
			/* 获取作者统计数据 */
			getUserStatistice(this.obj_authorInfo.userId)
			.then(res => {
				this.authorPoint = res.data.totalContribPoint
			})
		})
		.finally(() => this.gLoading(this,false))
	},
	onShareAppMessage(e){
		return {
			title: "Aha口袋",
			path: `pages/Interflow/Forum/ForumDetail?id=${this.postId}`,
			desc: "Aha口袋邀您阅读" + this.title,
		}
	},
	onReachBottom() {
		this.$refs["Comments"].loadComment()
	},
	methods: {
		/**
		 * 滑动事件
		 */
		ontouchMove(e)
		{
			/* 阻止滑动 */
			e.preventDefault()
		},
		/**
		 * 点击关注用户,根据用户关系执行关注/取消关注
		 */
		onclickAttention()
		{
			if(this.relation === 0) {
				followUser(this.obj_authorInfo.userId)
				this.relation = 2
			}
			else if(this.relation === 2) {
				unfollowUser(this.obj_authorInfo.userId)
				this.relation = 0
			}
		},
		/**
		 * 跳转评论区
		 */
		toComment()
		{
			uni.createSelectorQuery().select("#comments").boundingClientRect(data=>{//目标节点
			　　uni.createSelectorQuery().select("#forum").boundingClientRect((res)=>{//最外层盒子节点
					uni.pageScrollTo({
						duration:0,
						scrollTop: data.top - res.top,
					})
			　　}).exec()
			}).exec()
		},
		/**
		 * 点击收藏，切换收藏和未收藏状态
		 */
		onclickCollect()
		{
			this.is_collected = !this.is_collected
			collectDiscussion(this.postId,this.is_collected)
			if(this.is_collected){
				this.collections++
				uni.vibrateShort()
			}
			else {
				this.collections--
			}
		},
		/**
		 * 点击点赞
		 */
		onclickLike()
		{
			this.is_liked = !this.is_liked
			likeDiscussion(this.postId,this.is_liked)
			if(this.is_liked){
				this.likes++
				uni.vibrateShort()
			}
			else {
				this.likes--
			}
		},
		/**
		 * 开启写入框，根据不同模式，调用不同提示内容
		 * @param {Number} type 写入类型，0 写评论，1 回复评论，2 回复其他人回复
		 */
		startWrite(type,obj)
		{
			console.log(obj);
			switch(type) {
				case 0:
					this.obj_writeContent = {
						type: 0,
						placeholder: "友善发言..."
					}
					break
				case 1:
					this.obj_writeContent = {
						type: 1,
						placeholder: `回复${obj.userInfo.nickname}:`,
						commentId: obj.commentId,
						toUserId: obj.userInfo.userId
					}
					break
				case 2:
					this.obj_writeContent = {
						type: 2,
						placeholder: `@${obj.userInfo.nickname}:`,
						commentId: obj.commentId,
						toUserId: obj.userInfo.userId
					}
					break
			}
			
		},
		/**
		 * 写入完成，根据写入对象的type判断3种写入模式。
		 */
		writeFinish()
		{
			switch(this.obj_writeContent.type) {
				/* 新评论，重新根据时间优先请求评论 */
				case 0:
					this.$refs["Comments"].changeCommentSort("latest")
					this.commentNum++
					this.toComment()
					break
				/* 回复评论 && 回复其他回复，调用评论组件的回复成功方法 */
				case 1:
				case 2:
					this.$refs["Comments"].replySuccess(this.obj_writeContent.commentId)
					break
			}
			this.obj_writeContent = null
		},
		
	}
}
</script>

<style lang="stylus" scoped>
.forum-detail
	padding-bottom 50px
	min-height 100vh
	background-color var(--white1)
	.red
		color #f54d2c !important
	.edit
		position absolute
		right 5px
		top 5px
		color var(--gray1)
	.header
		padding 10px
		border-bottom var(--border2)
		background-color #FFFFFF
		.title
			padding-right 30px
			font-size 34rpx
			font-weight 700
			color var(--black)
		.data
			margin 10px 0
			font-size 20rpx
			color var(--gray2)
			display flex
			.time
				padding-right 10px
				border-right var(--border2)
			.read
				padding-left 10px
		.author
			position relative
			display flex
			align-items flex-start
			.avatar
				width 40px
				height 40px
				border-radius 50%
				padding 3px
				background-color var(--origin3)
				image
					width 100%
					height 100%
					border-radius 50%
			.name
				margin-left 10px
				flex 1
				height 100%
				white-space nowrap
				overflow-x hidden
				text-overflow ellipsis
			.level
				position absolute
				top 45rpx
				left 55px
			button
				margin-left 10px
				width 60px
				line-height 1.4
				font-size 22rpx
				border var(--border2)
				border-radius 22px
				color var(--font-dark)
				background-color transparent
	.content
		padding 10px
		background-color #FFFFFF
		.update-time
			margin 10px 0
			color var(--gray2)
			font-size 22rpx
			text-align end
		.like text
			margin-left 5px
	.comments
		margin 10px 0
	.footer-nav
		position fixed
		bottom 0
		width 100%
		padding 5px 10px
		height 50px
		border-top var(--border2)
		background-color #FFFFFF
		display flex
		align-items center
		justify-content space-between
		/* 写评论样式 */
		.wtrite-comment
			height 90% 
			width 40%
			padding 0 10px
			background-color var(--white1)
			border-radius 22px
			display flex
			align-items center
		/* 每个元素公共样式 */
		.ctr
			position relative
			padding-top 5px
			font-size 20rpx
			color var(--gray2)
			text-align center
			.iconfont
				color var(--font-dark)
				font-size 32rpx
				line-height 1.2
			/* 右上角小点 */
			.dot
				position absolute
				right 0
				top 0
				min-width 15px
				height 15px
				line-height 13px
				padding 0 2px
				border 1px solid #FFFFFF
				transform translateX(80%)
				border-radius 8px
				background-color #f54d2c
				color #FFFFFF
				font-size 16rpx
		/* 清除分享按键默认样式 */
		button
			margin 0
			line-height 1.2
			background-color transparent
			&:active
				transform none
</style>
