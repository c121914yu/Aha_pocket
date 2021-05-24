<!-- 
	通知信息详细
	author yjl
-->
<template>
	<view class="inform">
		<view class="head">
			<text class="remove iconfont icon-remove" @click="onclickRemoveInform"></text>
			<view class="h3">{{title}}</view>
			<view class="item">
				<text class="label">发件人:</text>
				<navigator 
					v-if="senderUser"
					class="sender"
					:url="'Inform_send?id=' + senderUser.userId"
					hover-class="none">
					<text class="active">{{senderUser.nickname}}</text>
					<text v-if="senderUser" class="reply iconfont icon-sixin"></text>
				</navigator>
				<text v-else class="sender">管理员</text>
			</view>
			<view class="item">
				<text class="label">收件人:</text>{{receiverUser.nickname}}
			</view>
			<view class="item">
				<text class="label">时&emsp;间:</text>{{receiveDate}}
			</view>
		</view>
		<view class="content rich-text" @click="gReadRichText(content,title)">
			<rich-text :nodes="content"></rich-text>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
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
	onLoad(e) {
		this.gLoading(this,true)
		this.id = e.id
		getMessage(this.id)
		.then(res => {
			if(!res.data) {
				this.gBackPage("通知无效")
				return
			}
			console.log(res.data)
			this.title = res.data.title
			this.senderUser = res.data.senderUser
			this.receiverUser = res.data.receiverUser
			this.type = res.data.type
			this.receiveDate = this.gformatDate(res.data.receiveDate,true)
			this.content = res.data.content.replace(/\n/g,"<br>")
		})
		.catch(err => {
			this.gBackPage("通知无效")
		})
		.finally(() => this.gLoading(this,false))
	},
	methods: {
		/**
		 * 点击删除通知，调用moda提示
		 */
		onclickRemoveInform()
		{
			this.gShowModal("确认删除该通知? ",() => {
				deleteMessage(this.id)
				this.gBackPage("删除成功")
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.inform
	.head
		padding 10px
		background-color var(--white1)
		.remove
			position absolute
			right 10px
			top 10px
			font-size 34rpx
			color #F56C6C
		.item
			padding 5px 0
			font-size 28rpx
			.label
				margin-right 10px
				color var(--gray1)
				font-size 24rpx
			.sender
				color var(--origin1)
				font-weight 700
				.active
					text-decoration underline
				.reply
					margin-left 10px
					font-size 30rpx
					font-weight 400
	.content
		padding 10px
</style>
