<!-- 
	我的评论内容
	author yjl
-->
<template>
	<view class="my-comments">
		
	</view>
</template>

<script>
import { getUserComments } from "@/static/request/api_forum.js"
export default {
	data() {
		return {
			pageNum: 0,
			pageSize: 10,
			is_loadAll: false,
			arr_comments: [],
			userId: getApp().globalData.gUserInfo.userInfo.userId
		}
	},
	onShow() {
		this.loadComments(true,true)
	},
	onReachBottom() {
		this.loadComments()
	},
	methods: {
		/**
		 * 获取评论
		 */
		loadComments(init=false,loading=false)
		{
			this.gLoading(this,loading)
			if(init) {
				this.pageNum = 0
				this.is_loadAll = false
			}
			if(this.is_loadAll) {
				return
			}
			getUserComments({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				userId: this.userId
			})
			.then(res => {
				if(init) {
					this.arr_comments = []
				}
				this.arr_comments = this.arr_comments.concat(res.data.pageData)
				if(res.data.pageData.length < this.pageSize) {
					this.is_loadAll = true
				}
				else {
					this.pageNum++
				}
				console.log(this.arr_comments);
				// if(this.arr_comments.length === 0) {
				// 	this.gBackPage("无点赞讨论")
				// }
			})
			.finally(() => this.gLoading(this,false))
		}
	},
}
</script>

<style lang="stylus" scoped>

</style>
