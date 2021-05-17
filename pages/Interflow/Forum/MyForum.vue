<!-- 
	我的讨论贴子
	author yjl
-->
<template>
	<view class="my-forum">
		<view class="navs">
			<top-navs :navs="arr_navs"></top-navs>
		</view>
		<!-- 帖子列表 -->
		<view class="list">
			<navigator
				class="forum"
				v-for="(item,index) in arr_forums"
				:key="item.id"
				:url="`/pages/Interflow/Forum/ForumDetail?id=${item.id}`">
				<forum-card :forum="item"></forum-card>
			</navigator>
		</view>
		<btn-bottom @click="onclickPublist">发布讨论</btn-bottom>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscussionTags,getMylikeDiscussion,deleteDiscussion } from "@/static/request/api_forum.js"
import ForumCard from "./components/ForumCard.vue"
export default {
	components: {
		"forum-card": ForumCard
	},
	data() {
		return {
			arr_forumTags: getApp().globalData.garr_forumTags,
			arr_navs: [
				{label: "主持贴"},
				{label: "点赞贴"},
				{label: "评论贴"}
			],
			pageNum: 0,
			pageSize: 10,
			is_loadAll: false,
			arr_forums: []
		}
	},
	onLoad() {
		if(this.arr_forumTags.length === 0) {
			/* 获取所有标签 */
			getDiscussionTags()
			.then(res => {
				getApp().globalData.garr_forumTags = res.data
				this.arr_forumTags = res.data
			})
		}
		this.loadDisc()
	},
	methods: {
		/**
		 * 加载帖子
		 */
		loadDisc(init=false,loading=false)
		{
			this.gLoading(this,loading)
			if(init) {
				this.pageNum = 0
			}
			getMylikeDiscussion({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				isLike: true
			})
			.then(res => {
				if(init) {
					this.arr_forums = []
				}
				if(res.data.pageData.length < this.pageSize) {
					this.is_loadAll = true
				}
				else {
					this.pageSize++
				}
				this.arr_forums = this.arr_forums.concat(res.data.pageData)
				console.log(this.arr_forums);
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 点击发布
		 */
		onclickPublist()
		{
			uni.navigateTo({
				url: "./Create_EditForum"
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.my-forum
	padding-top 40px
	margin-bottom 60px
	padding-bottom constant(safe-area-inset-bottom)
	padding-bottom env(safe-area-inset-bottom)
	.navs
		z-index 100
		position fixed
		top 0
		left 0
		right 0
	.list
		margin 10px 0
		background-color #FFFFFF
		.forum
			display block
			border-bottom var(--border2)
</style>
