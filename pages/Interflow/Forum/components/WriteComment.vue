<!-- 
	写评论弹窗
	author yjl
 -->
<template>
	<view class="write-comment">
		<view class="mask" @touchstart="$emit('close')"></view>
		<view class="container">
			<textarea
				class="textarea"
				focus="focus" 
				:placeholder="placeholder"
				auto-height="auto-height"
				maxlength="-1"
				cursor-spacing="120"
				:show-confirm-bar="false"
				v-model="content"/>
			<view class="footer">
				<view></view>
				<button class="btn" @click="onclickSend">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
import { postDiscComment,postDiscCommentReply } from "@/static/request/api_forum.js"
export default {
	props: {
		postId: {
			type: String,
			default: ""
		},
		placeholder: {
			type: String,
			default: ""
		},
		commentId: {
			type: String,
			default: ""
		},
		/* 回复对象的ID */
		toUserId: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			content: ""
		};
	},
	methods: {
		/**
		 * 点击发送按键,根据是否有toUserId判断是回复还是新评论。
		 */
		onclickSend()
		{
			if(!this.content) {
				return
			}
			/* 新评论 */
			if(this.toUserId === 0) {
				postDiscComment({
					postId: this.postId,
					content: this.content
				})
				.then(res => {
					this.$emit("writeFinish")
				})
			}
			/* 新回复 */
			else {
				postDiscCommentReply({
					toId: this.toUserId,
					commentId: this.commentId,
					content: this.content
				})
				.then(res => {
					this.$emit("writeFinish")
				})
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.write-comment
	z-index 10
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	.mask
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		background-color rgba(0,0,0,0.1)
	.container
		position absolute
		bottom 0
		width 100%
		padding 10px
		background-color #FFFFFF
		.textarea
			width 100%
			min-height 65px
			max-height 150px
			border-radius 8px
			padding 5px
			background-color var(--white1)
		.footer
			position relative
			margin-top 5px
			background-color #FFFFFF
			display flex
			justify-content space-between
			.btn
				margin 0
				line-height 1.4
				width 70px
				border-radius 8px
</style>
