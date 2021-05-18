<!-- 
	讨论详细页面 
	author yjl
-->
<template>
	<view class="forum-detail">
		<!-- 编辑按键 -->
		<navigator 
			v-if="relation===1" 
			class="edit"
			:url="`./Create_EditForum?id=${id}`">
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
		<!-- 评论区 -->
		<view class="comments">
			<!-- 无评论提示 -->
			<view v-if="commentNum===0" class="center no-comment" @click="onclickComment(true)">
				暂无评论,点击抢楼!
			</view>
			<!-- 评论列表 -->
			<comment-card
				v-for="(comment,i) in arr_comments"
				:key="comment.id"
				:comment="comment"
				@onclickLike="arr_comments[i].isLike=$event.isLike;arr_comments[i].likes=$event.likes"
				@reply="onclickReply">
			</comment-card>
			<!-- 查看全部评论 -->
			<view 
				v-if="commentNum > arr_comments.length" 
				class="read-allcomment center" 
				@click="onclickComment(false)">
				查看全部评论
			</view>
		</view>
		<!-- 推荐文章 -->
		<view class="recommend">
		</view>
		<!-- 底部导航 -->
		<view class="footer-nav">
			<view class="wtrite-comment" @click="onclickComment(true)">
				<text class="iconfont icon-write"></text>写评论...
			</view>
			<view class="ctr" @click="onclickComment(false)">
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
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscussion,getDiscComments,likeDiscussion,collectDiscussion } from "@/static/request/api_forum.js"
import { getUserRelation,followUser,unfollowUser,getUserStatistice } from '@/static/request/api_userInfo.js'
import CommentCard from "./components/CommentCard.vue"
export default {
	components: {
		"comment-card": CommentCard
	},
	data() {
		return {
			relation: 0, // 0-无关系 1-自己 2-已关注 3-被关注 4-互关
			id: "",
			obj_authorInfo: {},
			authorPoint: 0,
			commentNum: 0,
			arr_comments: [],
			content: "",
			createTime: new Date(),
			collections: 0,
			is_collected: false,
			likes: 0,
			is_liked: false,
			read: 0,
			tagId: 0,
			title: "讨论题目",
			updateTime: "",
			is_showCommentWindow: 0, // 0不展示，1展示，2展示并聚焦输入框
			/* 加载评论 */
			pageNum: 1,
			pageSize: 10
		}
	},
	onLoad(e) {
		this.id = e.id
		this.gLoading(this,true)
		getDiscussion(this.id)
		.then(res => {
			if(!res.data) {
				this.gBackPage("帖子无效")
			}
			this.obj_authorInfo = res.data.authorInfo
			this.commentNum = res.data.commentNum
			this.content = res.data.content
			this.createTime = res.data.createTime
			this.collections = res.data.collections
			this.is_collected = res.data.isCollected
			this.likes = res.data.likes
			this.is_liked = res.data.isLiked
			this.read = res.data.read
			this.tagId = res.data.tagId
			this.title = res.data.title
			this.updateTime = res.data.updateTime
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
	onShow() {
		getDiscComments({
			postId: this.id,
			pageNum: 0,
			pageSize: 5
		})
		.then(res => {
			this.arr_comments = res.data.pageData
		})
	},
	onShareAppMessage(e){
		return {
			title: "Aha口袋",
			path: `pages/Interflow/Forum/ForumDetail?id=${this.id}`,
			desc: "Aha口袋邀您阅读" + this.title,
		}
	},
	methods: {
		/**
		 * 点击关注用户
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
		 * 点击收藏，切换收藏和未收藏状态
		 */
		onclickCollect()
		{
			this.is_collected = !this.is_collected
			collectDiscussion(this.id,this.is_collected)
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
			likeDiscussion(this.id,this.is_liked)
			if(this.is_liked){
				this.likes++
				uni.vibrateShort()
			}
			else {
				this.likes--
			}
		},
		/**
		 * 点击评论卡片，触发回复
		 */
		onclickReply(comment)
		{
			uni.navigateTo({
				url: `./CommentWindow?id=${this.id}&focus=1&reply=${JSON.stringify(comment)}`
			})
		},
		/**
		 * 点击评论，跳转全部评论页面，并携带参数，判断是否需要聚焦输入框
		 * @param {Boolean} focus
		 */
		onclickComment(focus)
		{
			uni.navigateTo({
				url: `./CommentWindow?id=${this.id}&focus=${focus ? 1 : 0}`
			})
		}
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
				font-weight 700
				white-space nowrap
				overflow-x hidden
				text-overflow ellipsis
			.level
				position absolute
				top 40rpx
				left 60px
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
		background-color #FFFFFF
		.no-comment
			padding 10px
			color var(--origin1)
		.read-allcomment
			padding 10px
			color var(--origin1)
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
