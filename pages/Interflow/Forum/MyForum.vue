<!-- 
	我的讨论贴子
	author yjl
-->
<template>
	<view class="my-forum">
		<!-- 互动，点赞， -->
		<view class="header">
			<navigator hover-class="none" class="item" url="./MyInteraction">
				<text class="iconfont icon-hudong"></text>
				<view class="label">互动</view>
			</navigator>
			<navigator hover-class="none" class="item" url="./GoodsForums">
				<text class="iconfont icon-zan"></text>
				<view class="label">点赞</view>
			</navigator>
			<navigator hover-class="none" class="item" url="./History">
				<text class="iconfont icon-jilu-copy"></text>
				<view class="label">历史</view>
			</navigator>
		</view>
		<!-- 帖子列表 -->
		<view class="list">
			<view
				class="forum"
				v-for="(item,index) in arr_forums"
				:key="item.id">
				<forum-card :forum="item" @click="onclickForum"></forum-card>
			</view>
			<view v-if="arr_forums.length > 0" class="center remark">
				{{is_loadAll ? "已加载全部" : ""}}
			</view>
			<navigator v-else class="no-forum" hover-class="none" url="./Create_EditForum">
				还没有发布过讨论,点击立即发布!
			</navigator>
		</view>
		<btn-bottom @click="onclickPublist">发布讨论</btn-bottom>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscussionTags,getUserDiscussions,deleteDiscussion } from "@/static/request/api_forum.js"
import ForumCard from "./components/ForumCard.vue"
export default {
	components: {
		"forum-card": ForumCard
	},
	data() {
		return {
			pageNum: 0,
			pageSize: 10,
			is_loadAll: false,
			arr_forums: []
		}
	},
	onShow() {
		if(getApp().globalData.garr_forumTags.length === 0) {
			/* 获取所有标签 */
			getDiscussionTags()
			.then(res => {
				getApp().globalData.garr_forumTags = res.data
			})
		}
		this.loadDisc(true,true)
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
			getUserDiscussions({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				userId: getApp().globalData.gUserInfo.userInfo.userId
			})
			.then(res => {
				if(init) {
					this.arr_forums = []
				}
				this.arr_forums = this.arr_forums.concat(res.data.pageData)
				console.log(this.arr_forums);
				if(res.data.pageData.length < this.pageSize) {
					this.is_loadAll = true
				}
				else {
					this.pageNum++
				}
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 点击帖子，展开menu菜单
		 * @param {Object} forum
		 */
		onclickForum(forum)
		{
			this.gMenuPicker(["查看讨论","修改讨论","删除讨论"])
			.then(res => {
				switch(res) {
					case "查看讨论":
						uni.navigateTo({
							url: `./ForumDetail?id=${forum.id}`
						})
						break
					case "修改讨论":
						uni.navigateTo({
							url: `./Create_EditForum?id=${forum.id}`
						})
						break
					case "删除讨论":
						this.gShowModal("确认删除讨论？",() => {
							deleteDiscussion(forum.id)
							const index = this.arr_forums.findIndex(item => item.id === forum.id)
							this.arr_forums.splice(index,1)
							this.gToastMsg("讨论已删除")
						})
						break
				}
			})
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
	margin-bottom 60px
	padding-bottom constant(safe-area-inset-bottom)
	padding-bottom env(safe-area-inset-bottom)
	.header
		padding 15px 0
		display flex
		justify-content space-around
		.item
			text-align center
			.iconfont
				font-size 50rpx
				font-weight 700
	.list
		margin 10px 0
		background-color #FFFFFF
		.forum
			border-bottom var(--border2)
		.remark
			margin 10px 0
			color var(--gray2)
		.no-forum
			margin 20px 0
			text-align center
			color var(--origin1)
			font-size 30rpx
			font-weight 700
			display block
</style>
