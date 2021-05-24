<!-- 
	我点赞的讨论
	author yjl
 -->
<template>
	<view class="goods-forum">
		<navigator
			class="forum"
			v-for="(item,index) in arr_forums"
			:key="item.id"
			:url="`./ForumDetail?id=${item.id}`">
			<forum-card :forum="item"></forum-card>
		</navigator>
		<view v-if="arr_forums.length > 0" class="center remark">
			{{is_loadAll ? "已加载全部" : ""}}
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getMylikeDiscussion } from "@/static/request/api_forum.js"
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
		this.loadDisc(true,true)
	},
	onReachBottom() {
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
				this.is_loadAll = false
			}
			if(this.is_loadAll) {
				return
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
				this.arr_forums = this.arr_forums.concat(res.data.pageData)
				if(res.data.pageData.length < this.pageSize) {
					this.is_loadAll = true
				}
				else {
					this.pageNum++
				}
				console.log(this.arr_forums);
				if(this.arr_forums.length === 0) {
					this.gBackPage("无点赞讨论")
				}
			})
			.finally(() => this.gLoading(this,false))
		}
	}
}
</script>

<style lang="stylus" scoped>
.goods-forum
	.forum
		border-bottom var(--border2)
		display block
	.remark
		padding 10px 0
		color var(--gray2)
</style>
