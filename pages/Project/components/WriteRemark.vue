<!-- 写评论 -->
<template>
	<view class="write-remark" @touchmove.stop>
		<!-- 提示模块 -->
		<view v-if="type===0" class="remark-hint">
			<button class="write" @click="type=1">发表评论</button>
			<view class="icon iconfont icon-xinxi" @click="$emit('scrollComment')"></view>
			<view 
				v-if="isCollect" 
				class="icon iconfont icon-collection collected" 
				@click="onclickCollect">
			</view>
			<view 
				v-else 
				class="icon iconfont icon-shoucang" 
				@click="onclickCollect">
			</view>
			<button class="icon iconfont icon-share share" open-type="share"></button>
			<!-- <view class="webRead icon iconfont icon-airplaytouping" @click="webRead"></view> -->
		</view>
		<!-- 简要写评论模块 -->
		<view v-if="type===1" class="brief-write">
			<view class="blank" @click="type=0"></view>
			<view class="content">
				<view class="header">
					<view class="blank"></view>
					<aha-picker
						:arr_range="commentsRange"
						:startIndex="commentsRange.findIndex(item => item.value === checkCommentType.value)"
						placeholder="选择评论的附件"
						v-model="checkCommentType">
					</aha-picker>
				</view>
				<textarea
					class="textarea"
					maxlength="120"
					cursor-spacing="120"
					:show-confirm-bar="false"
					auto-height="auto-height"
					focus="focus"
					placeholder="写下你的评论,让大家了解更多"
					v-model="commentContent.val"/>
				<!-- 评分 -->
				<view class="footer">
					<comment-star v-if="checkCommentType.value!=='public'" v-model="score"></comment-star>
					<view v-else></view>
					<button class="publish" @click="onclickPublish">发表</button>
				</view>
			</view>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { isCollected, collectProject, cancleCollectProject,postRemark,postPublicComment } from '@/static/request/api_project.js';
export default {
	props: {
		projectId: Number,
		files: Array
	},
	data() {
		return {
			type: 0,
			isCollect: false,
			commentContent: {
				val: "",
				errMsg: "评论内容不能为空"
			},
			checkCommentType: {
				label: "公开讨论",
				value: "public"
			},
			score: 5
		}
	},
	computed: {
		commentsRange(){
			const publicComment = [{
				label: "公开讨论",
				value: "public"
			}]
			return publicComment.concat(this.files.map(file => {
				return {
					label: file.name,
					value: file.id
				}
			}))
		}
	},
	created() {
		/* 判断是否收藏 */
		isCollected(this.projectId)
		.then(res => {
			this.isCollect = res.data
		})
	},
	methods:{
	    /**
		 * 根据当前收藏状态判断，收藏项目还是取消收藏，修改收藏状态及项目收藏数量
		 */
		onclickCollect()
		{
			/* 本是收藏的，取消收藏 */
			if (this.isCollect) {
				cancleCollectProject(this.projectId)
				this.$emit("collectChange",-1)
			} 
			/* 本是未收藏的收藏 */
			else {
				collectProject(this.projectId)
				this.$emit("collectChange",1)
				uni.vibrateShort()
			}
			this.isCollect = !this.isCollect
		},
		/* 浏览器阅读 */
		webRead()
		{
			this.gClipboardData(
			`http://localhost:8081/project/read/${this.projectId}/${uni.getStorageSync("token")}`,
			"已复制连接,请用电脑浏览器打开!"
			)
		},
		/**
		 * 点击发表评论
		 */
		onclickPublish()
		{
			if(!this.gIsNull([this.commentContent])){
				this.gLoading(this,true)
				let postFn
				if(this.checkCommentType.value === "public"){
					postFn = postPublicComment({
						projectId: this.projectId,
						comment: this.commentContent.val,
					})
				}
				else{
					postFn = postRemark(this.checkCommentType.value,{
						comment: this.commentContent.val,
						score: this.score
					})
				}
				postFn.then(res => {
					this.gToastSuccess("评论成功")
					this.type = 0
					this.commentContent.val = ""
					this.checkCommentType = {
						label: "公开讨论",
						value: "public"
					}
					this.score = 5
					this.$emit("success")
				})
				.finally(() => this.gLoading(this,false))
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.write-remark
	/* 提示 */
	.remark-hint
		position fixed
		bottom 0
		left 0
		right 0
		padding 0 20px
		border-top-left-radius 16px
		border-top-right-radius 16px
		background-color var(--origin2)
		display flex
		align-items center
		justify-content space-between
		padding-bottom constant(safe-area-inset-bottom)
		padding-bottom env(safe-area-inset-bottom)
		.write
			margin 12px 0
			width 60%
			padding 7px
			line-height 1
			background-color #FFFFFF
			color var(--font-dark)
			border-radius 22px
		.icon
			font-size 46rpx
			color #FFFFFF
			&.collected
				color #e86452
			&.share
				margin 0
				padding 0
				line-height 1
				background-color transparent
			&.webRead
				color var(--origin1)
	/* 简要写评论 */
	.brief-write
		z-index 100
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		background-color rgba(0,0,0,0.2)
		display flex
		flex-direction column
		justify-content space-between
		.blank
			flex 1
			width 100%
		.content
			width 100%
			padding 10px
			background-color #FFFFFF
			.header
				margin-bottom 5px
				display flex
				justify-content space-between
			.textarea
				margin 5px 0
				width 100%
				min-height 80px
				max-height 300px
				padding 5px
				background-color var(--white1)
			.footer
				margin 10px 0 5px
				display flex
				justify-content space-between
				.publish
					margin-right 10px
					line-height 2
					padding 0 20px
					font-size 24rpx
</style>
