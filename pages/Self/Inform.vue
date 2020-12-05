<!-- 通知信息 -->
<template>
	<view class="inform">
		<view class="head">
			<text class="iconfont icon-remove" @click="removeInform"></text>
			<view class="h3">{{title}}</view>
			<view class="item">
				<text class="label">发件人:</text><text class="strong send-name">{{senderUser.nickname}}</text>
			</view>
			<view class="item">
				<text class="label">收件人:</text>{{receiverUser.nickname}}
			</view>
			<view class="item">
				<text class="label">时&emsp;间:</text>{{receiveDate}}
			</view>
		</view>
		<view class="content" v-html="content"></view>
		<!-- 操作按键 -->
		<view class="btns">
			<button class="mark-unread" @click="markUnread">标记为未读</button>
			<button @click="reply">回复发件人</button>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getMessage,deleteMessage } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			id: "",
			title: "",
			senderUser: "",
			receiverUser: "",
			type: 0,
			receiveDate: "",
			content: ""
		}
	},
	methods: {
		/* 
			name: 删除通知
			desc： 调用modal提示框确认删除消息。
			time: 2020/12/1
		*/
		removeInform()
		{
			this.gShowModal("确认删除该通知? ",() => {
				deleteMessage(this.id)
				uni.navigateBack({
					delta: 1,
					success: () => {
						this.gToastSuccess("删除成功!")
					}
				})
			})
		},
		/* 
			name: markUnread
			desc: mark this infor to unread status by id
			time: 2020/12/1
		*/
		markUnread()
		{
			this.gToastSuccess("标记为未读")
		},
		/* 
			name: reply
			desc: reply the sendAuthor. will navigator to Inform_send page
			time: 2020/12/1
		*/
		reply()
		{
			let senderId = ''
			if(this.senderUser){
				senderId = this.senderUser.userId
			}
			uni.navigateTo({
				url: "Inform_send?id=" + senderId
			})
		}
	},
	onLoad(e) {
		this.gLoading(this,true)
		getMessage(e.id)
		.then(res => {
			console.log(res);
			for(let key in res.data)
				this[key] = res.data[key]
			this.gLoading(this,false)
		})
		.catch(err => {
			this.gLoading(this,false)
		})
	}
}
</script>

<style lang="stylus" scoped>
.inform
	.head
		padding 10px
		background-color var(--white1)
		.iconfont
			position absolute
			right 10px
			top 10px
			font-size 34rpx
			color #F56C6C
	.item
		margin 5px 0
		font-size 28rpx
		.label
			margin-right 10px
			color var(--gray1)
		.send-name
			color var(--origin1)
	.content
		padding 10px
		text-indent 60rpx
		word-break break-all
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
			width 33%
			&.mark-unread
				background-color var(--gray1)
</style>
