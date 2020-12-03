<!-- 消息发送 -->
<template>
	<view class="send-inform">
		<view class="head">
			<view class="item">
				<text class="label">主&emsp;题:</text>
				<input type="text" placeholder="通知主题">
			</view>
			<view class="item">
				<text class="label">收件人:</text>
				<input type="text" placeholder="收件人手机号">
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
			<button>发送</button>
		</view>
		
		<view class="edit" v-if="editContent">
			<MdEdit :html="content" @editOk="editOk"></MdEdit>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: "",
			sendName: "余金隆",
			receiveName: "",
			content: "",
			editContent: false
		}
	},
	methods: {
		editOk(html)
		{
			this.content = html
			this.editContent = false
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
