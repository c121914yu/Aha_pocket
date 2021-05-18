<!-- 
	论坛列表 
	author yjl
-->
<template>
	<view class="forums">
		<view class="filter">
			<view class="tags">
				<view
					:class="i === activeTagIndex ? 'active' : ''"
					class="tag"
					v-for="(tag,i) in arr_forumTags"
					:key="tag.id"
					@click="activeTagIndex=i">
					{{tag.name}}
				</view>
			</view>
			<view class="sort" @click="onclickSort">
				{{strategy.label}}
				<text class="iconfont icon-sort"></text>
			</view>
		</view>
		<!-- 搜索框 -->
		<view class="search">
			<search-input 
				style="flex: 1;"
				:radius="8"
				placeholder="搜索帖子" 
				v-model="searchText">
			</search-input>
			<navigator hover-class="none" url="/pages/Interflow/Forum/Create_EditForum">
				<text class="iconfont icon-add-fill"></text>
			</navigator>
		</view>
		<!-- 帖子列表 -->
		<view class="list">
			<navigator
				class="forum"
				v-for="(item,index) in arr_discussions"
				:key="item.id"
				:url="`/pages/Interflow/Forum/ForumDetail?id=${item.id}`">
				<forum-card :forum="item"></forum-card>
			</navigator>
		</view>
		<navigator 
			v-if="arr_discussions.length===0" 
			hover-class="none"
			class="remark center"
			:url="`/pages/Interflow/Forum/Create_EditForum?tagId=${arr_forumTags[activeTagIndex].id}`">
			没有找到相关讨论,点击创建!
		</navigator>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscussionTags,getAllDiscussions,getDiscussions } from "@/static/request/api_forum.js"
import ForumCard from "./components/ForumCard.vue"
export default {
	components: {
		"forum-card": ForumCard
	},
	data() {
		return {
			arr_forumTags: [],
			arr_sort: [
				{label: "时间",value: "latest"},
				{label: "热度",value: "hottest"}
			],
			strategy: {label: "时间",value: "latest"}, // 排序方式
			activeTagIndex: 0,
			pageNum: 0,
			pageSize: 15,
			is_loadAll: false,
			arr_discussions: [],
			searchText: ""
		}
	},
	watch: {
		"activeTagIndex": function() {
			this.loadDisc(true,true)
		}
	},
	created() {
		const tags = getApp().globalData.garr_forumTags
		if(tags.length === 0) {
			/* 获取所有标签 */
			getDiscussionTags()
			.then(res => {
				getApp().globalData.garr_forumTags = res.data
				this.arr_forumTags = [{id: null,name: "全部"}].concat(res.data)
			})
		}
		else {
			this.arr_forumTags = [{id: null,name: "全部"}].concat(tags)
		}
		this.loadDisc(true,true)
	},
	methods: {
		/**
		 * 加载讨论帖子
		 */
		loadDisc(init=false,loading=false)
		{
			if(init) {
				this.pageNum = 0
				this.is_loadAll = false
			}
			if(this.is_loadAll) {
				return
			}
			this.gLoading(this,loading)
			const params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				strategy: this.strategy.value
			}
			let p
			if(this.activeTagIndex === 0) {
				p = getAllDiscussions(params)
			}
			else {
				p = getDiscussions({
					...params,
					tagId: this.arr_forumTags[this.activeTagIndex].id
				})
			}
			p.then(res => {
				if(init) {
					this.arr_discussions = []
				}
				this.arr_discussions = this.arr_discussions.concat(res.data.pageData)
				/* 判断页码 */
				if(res.data.pageData.length < this.pageSize) {
					this.is_loadAll = true
				}
				else {
					this.pageNum++
				}
				console.log(this.arr_discussions);
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 点击筛选.调用menu弹窗选择排序
		 */
		onclickSort()
		{
			this.gMenuPicker(this.arr_sort)
			.then(res => {
				if(res.value !== this.strategy.value) {
					this.strategy = res
					this.loadDisc(true,true)
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.forums
	padding-top 42px
	min-height 100vh
	background-color var(--white1)
	.filter
		z-index 10
		position fixed
		top 50px
		background-color #FFFFFF
		border-bottom var(--border2)
		.tags
			height 42px
			margin-right 50px
			padding 0 5px
			display flex
			align-items center
			overflow-x auto
			&::-webkit-scrollbar
				display: none
			.tag
				flex-shrink 0
				margin 0 5px
				padding 10px 5px
				border-bottom 3px solid transparent
				&.active
					color var(--origin2)
					border-bottom-color var(--origin2)
		.sort
			position fixed
			background-color #FFFFFF
			right 0
			top 50px
			height 42px
			padding 0 5px
			border-left var(--border2)
			color var(--origin1)
			display flex
			align-items center
			.iconfont
				margin-left 2px
				font-size 24rpx
	.search
		margin 10px 0
		padding 0 10px
		display flex
		align-items center
		.iconfont
			margin-left 5px
			font-size 40rpx
			color var(--origin2)
	.list
		margin 10px 0
		background-color #FFFFFF
		.forum
			display block
			border-bottom var(--border2)
	.remark
		margin 10px 0
		color var(--origin1)
		display block
</style>
