<!-- 
	用户反馈页面
	author yjl
-->
<template>
	<view class="feedback">
		<view class="feedback-type">
			<view 
				class="item"
				:class="type === item.value ? 'active' : ''"
				v-for="(item,index) in types"
				:key="index"
				@click="type = (type===item.value) ? null : item.value">
				<text>{{item.label}}</text>
				<text class="iconfont icon-bottom"></text>
			</view>
			<navigator class="myfeedback item" url="FeedBack_self">
				<text>查看我的反馈</text>
				<text class="iconfont icon-bottom"></text>
			</navigator>
		</view>
		<view class="content" v-if="type !== null">
			<textarea
				placeholder="写下您的意见或遇到的问题..." 
				maxlength="-1"
				auto-height	
				v-model="content"/>
			<button class="center" @click="submitFeedback">反馈</button>
		</view>
	</view>
</template>

<script>
import { feedbackProblem } from "@/static/request/api_system.js"
export default {
	data() {
		return {
			types: getApp().globalData.garr_feedbackTypes,
			content: "",
			type: null,
		}
	},
	methods: {
		/**
		 * 提交反馈
		 */
		submitFeedback()
		{
			if(this.content){
				this.gShowModal("您确认提交反馈？",() => {
					feedbackProblem({
						type: this.type,
						content: this.content
					})
					.then(res => {
						uni.navigateTo({
							url: "FeedBack_self",
							success: () => {
								this.gToastSuccess("感谢您的反馈")
							}
						})
					})
				})
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.feedback
	.feedback-type
		.item
			padding 15px 10px
			border-bottom var(--border2)
			display flex
			justify-content space-between
			&:active, &.active
				background-color rgba(144,140,139,0.1)
			&.myfeedback
				color var(--gray1)
	.content
		margin-top 10px
		textarea
			width 100%
			min-height 100px
		button
			margin-top 10px
			width 100px
			padding 0
			border-radius 22px
	.success
		margin-top 10px
		color var(--origin1)
		font-weight 600
</style>
