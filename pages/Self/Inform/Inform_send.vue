<!-- 消息发送 -->
<template>
	<view class="send-inform">
		<view class="head">
			<view class="item">
				<text class="label">主&emsp;题:</text>
				<input type="text" placeholder="通知主题" v-model="title">
			</view>
			<view class="item">
				<text class="label">收件人:</text>
				<input type="text" placeholder="收件人ID" v-model.number="receiverUserId">
			</view>
			<view class="item">
				<text class="label">发件人:</text>{{sendName}}
			</view>
		</view>
		<!-- 信息内容 -->
		<view class="content">
			<view v-if="content" v-html="content"></view>
			<view class="hint" v-else>无内容...</view>
		</view>
		<!-- 操作按键 -->
		<view class="btns">
			<button class="edit" @click="startEdit">编辑</button>
			<button class="send" @click="sendMsg">发送</button>
		</view>
		
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { postMessage } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			name: "",
			sendName: getApp().globalData.gUserInfo.userInfo.nickname,
			receiverUserId: "",
			title: "",
			content: "",
			editContent: false
		}
	},
	onLoad(e) {
		if(e.id){
			this.receiverUserId = e.id
		}
	},
	onShow() {
		if(this.editContent){
			this.content = getApp().globalData.gEditContent
			this.editContent = false
		}
	},
	methods: {
		/* 开始编辑 */
		startEdit()
		{
			this.editContent = true
			getApp().globalData.gEditContent = this.content
			uni.navigateTo({
				url: "../../EditMd/EditMd"
			})
		},
		/* 点击发送 */
		sendMsg()
		{
			if(this.title === ""){
				this.gToastError("主题为空")
			}
			else if(this.receiverUserId === ""){
				this.gToastError("收件人为空")
			}
			else if(this.content === ""){
				this.gToastError("内容为空")
			}
			else{
				this.gLoading(this,true)
				postMessage({
					receiverUserId: this.receiverUserId,
					title: this.title,
					content: this.content
				})
				.then(res => {
					uni.navigateBack({
						delta: 1,
						success: () => {
							this.gToastSuccess("发送成功")
						}
					})
					this.gLoading(this,false)
				})
				.catch(err => {
					this.gLoading(this,false)
				})
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
		position absolute
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
	.editor
		z-index 5
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		background-color #FFFFFF
</style>
