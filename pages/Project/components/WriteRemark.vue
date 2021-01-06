<!-- 写评论 -->
<template>
	<view class="write-remark">
		<!-- 提示模块 -->
		<view v-if="type===0" class="remark-hint">
			<view class="input" @click="startComment">
				<text class="iconfont icon-write"></text>
				<text>写下你的评论...</text>
			</view>
			<text class="icon iconfont icon-xinxi" @click="$emit('scrollComment')"></text>
			<text v-if="isCollect" class="icon iconfont icon-collection collected" @click="collected"></text>
			<text v-else class="icon iconfont icon-shoucang" @click="collected"></text>
			<button class="icon iconfont icon-share share" open-type="share"></button>
		</view>
		<!-- 简要写评论模块 -->
		<view v-if="type===1" class="brief-write">
			<view class="blank" @click="type=0"></view>
			<view class="content">
				<view class="header">
					<view class="blank"></view>
					<SPicker
						:range="fileRange"
						:startIndex="checkFile ? fileRange.indexOf(checkFile) : 0"
						placeholder="选择评论的附件"
						v-model="checkFile">
					</SPicker>
				</view>
				<textarea 
					placeholder="写下你的评论,让大家了解更多" 
					v-model="commentContent"
					maxlength="-1"
					auto-height	/>
				<!-- 评分 -->
				<view class="footer">
					<CommentStar v-model="score"></CommentStar>
					<text class="publish" @click="publish">发表</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { isCollected, collectProject, cancleCollectProject,postRemark } from '@/static/request/api_project.js';
export default {
	props: {
		projectId: Number,
		files: Array
	},
	data() {
		return {
			type: 0,
			isCollect: false,
			commentContent: "",
			checkFile: "",
			score: 5
		}
	},
	computed: {
		fileRange(){
			return this.files.map(item => item.name)
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
		/*
			name: 收藏/取消收藏项目
			desc：根据当前收藏状态判断，收藏项目还是取消收藏，修改收藏状态及项目收藏数量
		*/
		collected() {
			/* 本是收藏的，取消收藏 */
			if (this.isCollect) {
				cancleCollectProject(this.projectId)
				this.$emit("collectChange",-1)
			} else {
			/* 本事未收藏的收藏 */
				collectProject(this.projectId)
				this.$emit("collectChange",1)
				uni.vibrateShort() // 短暂震动
			}
			this.isCollect = !this.isCollect
		},
		/* 开始写评论 */
		startComment()
		{
			this.checkFile = ""
			this.commentContent = ""
			this.type = 1
		},
		/* 发表评论 */
		publish()
		{
			if(this.commentContent === ""){
				return
			}
			if(this.checkFile === ""){
				this.gToastError("选择评论附件")
				return
			}
			/* 查找ID */
			const file = this.files.find(item => item.name === this.checkFile)
			const data = {
				comment: this.commentContent,
				score: this.score
			}
			postRemark(file.id,data)
			.then(res => {
				this.gToastSuccess("评论成功")
				this.type = 0
				this.$emit("success")
			})
		}
	},
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
		padding 10px
		border-top var(--border2)
		background-color #FFFFFF
		display flex
		align-items center
		justify-content space-between
		.input
			width 60%
			padding 5px 10px
			background-color var(--white1)
			font-size 24rpx
			border-radius 22px
			.iconfont
				margin-right 5px
		.icon
			font-size 40rpx
			&.collected
				color #e86452
			&.share
				margin 0
				padding 0
				background-color transparent
				color var(--black)
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
			textarea
				width 100%
				min-height 100px
				background-color var(--white1)
			.footer
				margin 10px 0 5px
				display flex
				justify-content space-between
				.publish
					margin-right 10px
					color var(--origin1)
</style>
