<!-- 我的反馈 -->
<template>
	<view class="my-feedback">
		<view 
			class="feedback-card"
			v-for="(feedback,index) in feedbacks"
			:key="index">
			<view 
				class="head"
				:style="{'background-color': feedback.status.color}">
				<text class="type">{{feedback.type}}</text>
				<text class="time">{{feedback.time}}</text>
			</view>
			<view class="content">
				{{feedback.content}}
			</view>
			<view v-if="feedback.status.value === 0" class="result" :style="{'color': feedback.status.color}">
				{{feedback.status.label}}
			</view>
			<view v-if="feedback.status.value === 1" class="result" :style="{'color': feedback.status.color}">
				{{feedback.replyTime}} - {{feedback.reply}}
			</view>
			<view v-else-if="feedback.status.value === 2" class="result">
				{{feedback.replyTime}}已解决,<text class="strong">{{feedback.level}}</text>问题
			</view>
		</view>
		<view class="center small remark">{{is_loadAll ? "已加载全部" : ""}}</view>
	</view>
</template>

<script>
import { getFeedbackMe } from "@/static/request/api_system.js"
export default {
	data() {
		return {
			pageNum: 1,
			pageSize: 8,
			is_loadAll: false,
			feedbacks: [],
			arr_status: [
				{label: "待处理",value: 0,color: "#909399"},
				{label: "处理中",value: 1,color: "#f8b86b"},
				{label: "已处理",value: 2,color: "#67C23A"}
			],
			arr_feedbackResult: [
				{text:"无效反馈",value:0},
				{text:"轻微问题",value:1},
				{text:"中等问题",value:2},
				{text:"严重问题",value:3}
			]
		}
	},
	onLoad() {
		this.getFeedback(true)
	},
	onReachBottom() {
		if(!this.is_loadAll){
			this.getFeedback()
		}
	},
	methods: {
		/* 判断是否加载全部 */
		judgeLoadAll(size)
		{
			this.is_loadAll = false
			if(size < this.pageSize)
				this.is_loadAll = true
			else
				this.pageNum++
		},
		getFeedback(init=false)
		{
			if(init){
				this.pageNum = 1
			}
			getFeedbackMe({
				pageNum: this.pageNum,
				pageSize: this.pageSize
			})
			.then(res => {
				this.judgeLoadAll(res.data.pageData.length)
				const data = res.data.pageData.map(feedback => {
					const type = getApp().globalData.feedbackTypes.find(item => item.value === feedback.type)
					const result = this.arr_feedbackResult.find(item => item.value === feedback.level)
					return{
						...feedback,
						type: type.label,
						time: this.gformatDate(feedback.time),
						replyTime: this.gformatDate(feedback.replyTime),
						status: this.arr_status.find(item => item.value === feedback.status),
						level: result ? result.text : ""
					}
				})
				this.feedbacks = init ? data : this.feedbacks.concat(data)
				console.log(this.feedbacks);
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.my-feedback
	min-height 100vh
	padding 10px 5%
	background-color var(--white1)
	.feedback-card
		margin-bottom 10px
		background-color #FFFFFF
		border-radius 8px
		overflow hidden
		.head
			padding 10px
			font-size 24rpx
			display flex
			align-items flex-end
			justify-content space-between
			.type
				color #FFFFFF
			.time
				font-size 20rpx
				color #f4f4f4
		.content
			padding 5px
			font-size 22rpx
			border-bottom var(--border2)
		.result
			padding 5px
			font-size 22rpx
			text-align end
			.point
				color var(--origin1)
				font-weight 700
	.remark
		margin-top 10px
		color var(--gray2)
</style>
