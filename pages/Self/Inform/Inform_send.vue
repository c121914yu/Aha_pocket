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
				<input type="text" placeholder="收件人UserId" v-model.number="receiverUserId">
			</view>
			<view class="item">
				<text class="label">发件人:</text>{{sendName}}
			</view>
		</view>
		<view class="content">
			<view v-if="content" v-html="content"></view>
			<view v-else>无内容...</view>
			<button @click="editContent=true">编辑内容</button>
		</view>
		<view class="btns">
			<button @click="sendMsg">发送</button>
		</view>
		
		<view class="edit" v-if="editContent">
			<MdEdit :html="content" @editOk="editOk"></MdEdit>
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
			sendName: "余金隆",
			receiverUserId: "",
			title: "",
			content: "",
			editContent: false
		}
	},
	methods: {
		/* 富文本编辑完成 */
		editOk(html)
		{
			this.content = html
			this.editContent = false
		},
		/* 点击发送 */
		sendMsg()
		{
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
	},
	onLoad(e) {
		if(e.id){
			this.receiverUserId = e.id
		}
	}
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
	.content
		padding 10px
		word-break break-all
		padding-bottom 70px
		button
			width 50%
			background-color var(--gray1)
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
		button
			width 100%
	.edit
		z-index 5
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		background-color #FFFFFF
</style>
