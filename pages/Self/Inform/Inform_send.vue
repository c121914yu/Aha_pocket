<!-- 
	消息发送
	author yjl
-->
<template>
	<view class="send-inform">
		<view class="head">
			<view class="item">
				<text class="label">主&emsp;题:</text>
				<input type="text" placeholder="通知主题" v-model="title.val">
			</view>
			<view class="item">
				<text class="label">收件人:</text>
				<input type="text" placeholder="收件人ID" v-model.number="receiverUserId.val">
			</view>
			<view class="item">
				<text class="label">发件人:</text>{{sendName}}
			</view>
		</view>
		<!-- 信息内容 -->
		<view class="content">
			<view v-if="content.val">
				<rich-text :nodes="content.val"></rich-text>
			</view>
			<view v-else class="remark" @click="onclickEdit">点击编辑发送内容</view>
		</view>
		<!-- 操作按键 -->
		<view class="btns">
			<button class="edit" @click="onclickEdit">编辑</button>
			<button class="send" @click="onclickSend">发送</button>
		</view>
		
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { postMessage } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			sendName: getApp().globalData.gUserInfo.userInfo.nickname,
			title: {
				val: "",
				errMsg: "主题不能为空"
			},
			receiverUserId: {
				val: "",
				errMsg: "收件人不能为空"
			},
			content: {
				val: "",
				errMsg: "内容不能为空"
			}
		}
	},
	onLoad(e) {
		if(e.id){
			this.receiverUserId.val = e.id
		}
	},
	onShow() {
		this.content.val = getApp().globalData.gEditContent
		getApp().globalData.gEditContent = ""
	},
	methods: {
		/**
		 * 开始编辑
		 */
		onclickEdit()
		{
			getApp().globalData.gEditContent = this.content.val
			uni.navigateTo({
				url: "../../EditMd/EditMd"
			})
		},
		/**
		 * 点击发送
		 */
		onclickSend()
		{
			if(!this.gIsNull([this.title,this.receiverUserId,this.content])){
				this.gLoading(this,true)
				postMessage({
					receiverUserId: +this.receiverUserId.val,
					title: this.title.val,
					content: this.content.val
				})
				.then(res => {
					this.gBackPage("发送成功")
				})
				.finally(() => this.gLoading(this,false))
			}
		}
	},
}
</script>

<style lang="stylus" scoped>
.send-inform
	.head
		padding 10px
		background-color var(--white1)
		input
			flex 1
			border var(--border1)
			padding 0 5px
			border-radius 4px
		.item
			margin 10px 0
			display flex
			align-items center
			.label
				margin-right 10px
				color var(--gray1)
				font-size 24rpx
	.content
		padding 10px
		word-break break-all
		padding-bottom 70px
		.hint
			color var(--gray2)
	.btns
		position fixed
		bottom 0
		left 0
		right 0
		padding 10px
		background-color #FFFFFF
		box-shadow 0 2px 5px var(--gray2)
		border-top-left-radius 22px
		border-top-right-radius 22px
		display flex
		justify-content space-around
		button
			width 35%
		.edit
			background-color var(--gray1)
</style>
