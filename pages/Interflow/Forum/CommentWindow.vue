<!-- 
	评论弹窗
	author yjl
 -->
<template>
	<view class="comments-window" @click="is_writing=false">
		<view class="no-comment" v-if="arr_comments.length===0">
			还没有人评论,快来抢占位置吧!
		</view>
		<view class="write" @click.stop>
			<view v-show="is_writing">
				<textarea
					:focus="is_writing" 
					auto-height="auto-height"
					maxlength="-1"
					v-model="content"/>
				<view class="footer">
					<button @click="onclickSend">发送</button>
				</view>
			</view>
			<view v-show="!is_writing" class="hint" @click="is_writing=true">写评论...</view>
		</view>
	</view>
</template>

<script>
import { getDiscComments,getDiscCommentsReply,postDiscComment,postDiscCommentReply } from "@/static/request/api_forum.js"
export default {
	props: {
		is_showCommentWindow: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			id: "",
			pageNum: 1,
			pageSize: 10,
			is_loadAll: false,
			is_writing: false,
			content: "",
			arr_comments: []
		}
	},
	onLoad(e) {
		console.log(e);
		this.id = e.id
		this.is_writing = e.focus === "1"
	},
	methods: {
		/**
		 * 点击发送按键
		 */
		onclickSend()
		{
			if(!this.content) {
				this.gToastMsg("评论内容不能为空")
			}
			else {
				postDiscComment({
					postId: this.id,
					content: this.content
				})
				.then(res => {
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
	background-color #f4f4f4
	.no-comment
		position absolute
		top 45%
		left 50%
		transform translate(-50%,-100%)
	.write
		position absolute
		bottom 0
		width 100%
		padding 10px
		background-color #FFFFFF
		.hint
			padding 10px
			border-radius 8px
			background-color var(--white1)
		textarea
			width 100%
			min-height 65px
			max-height 150px
			border-radius 8px
			padding 5px
			font-size 24rpx
			background-color var(--white1)
	.footer button
		float right
		margin-top 5px
		line-height 1.4
		width 60px
		border-radius 22px
</style>
