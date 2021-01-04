<!-- 通知 -->
<template>
	<view class="inform">
		<!-- 清除未读 -->
		<view class="head small">
			<text>
				有
				<text class="strong">{{ unreaded }}</text>
				条消息未读取
			</text>
			<text class="iconfont icon-clear"></text>
			<text class="strong">清除未读</text>
		</view>
		<!-- 通知列表 -->
		<view class="informs">
			<navigator 
				class="item" 
				:class="item.type === 0 ? 'system' : ''"
				v-for="(item, index) in arr_informs" 
				:key="index" 
				:url="'Inform?id=' + item.id"
				hover-class="none">
				<image 
					:class="item.status === 0 ? 'unread' : ''" 
					src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png">
				</image>
				<view class="right small">
					<view class="title">
						<text class="title">{{ item.title }}</text>
						<text class="time">{{ item.receiveDate }}</text>
					</view>
					<view class="content" v-html="item.content"></view>
				</view>
			</navigator>
		</view>
		<view class="remark center">{{ is_showAll ? "已加载全部" : "" }}</view>
		<!-- 发送信息 -->
		<navigator class="send-inform" hover-class="none" url="Inform_send"><text class="iconfont icon-tianjia"></text></navigator>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getMessages } from '@/static/request/api_userInfo.js';
export default {
	data() {
		return {
			pageNum: 1,
			pageSize: 15,
			arr_informs: [],
			is_showAll: false
		};
	},
	computed: {
		unreaded() {
			const unread = this.arr_informs.filter(item => item.status === 0).length
			/* 更新未读信息 */
			uni.$emit("upDateUnread",unread)
			return unread
		}
	},
	onShow() {
		this.getMsg(true,true)
	},
	onPullDownRefresh() {
		this.getMsg(true)
	},
	onReachBottom() {
		if (!this.is_showAll) {
			this.getMsg(false,false)
		}
	},
	methods: {
		/* 获取消息列表 */
		getMsg(init=false,loading=true) 
		{
			this.gLoading(this, loading)
			if(init){
				this.pageNum = 1
			}
			getMessages({
				pageNum: this.pageNum,
				pageSize: this.pageSize
			})
			.then(res => {
				/* 是否加载所有 */
				if(res.data.pageData < this.pageSize){
					this.is_showAll = true
				}
				else{
					this.pageNum++
				}
				
				if(init){
					this.arr_informs = []
				}
				res.data.pageData.forEach(item => {
					item.receiveDate = this.gformatDate(item.receiveDate)
					this.arr_informs.push(item)
				})
				console.log(this.arr_informs);
				uni.stopPullDownRefresh()
				this.gLoading(this, false)
			})
			.catch(err => {
				this.gLoading(this, false)
				uni.stopPullDownRefresh()
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.inform
	background-color #f9f9f9
	min-height 100vh
	.head
		padding 10px
		color var(--gray1)
		.iconfont
			margin 0 2px 0 10px
	.send-inform
		position fixed
		right 10px
		bottom 20px
		text
			font-size 60rpx
			color var(--origin1)
	/* 通知列表 */
	.informs
		box-shadow var(--shadow2)
		.item
			padding 10px
			background-color #FFFFFF
			display flex
			image
				position relative
				width 50px
				height 50px
				border-radius 4px
				&.unread::after
					z-index 10
					content ''
					position absolute
					top 0
					right 0
					width 8px
					height 8px
					border-radius 50%
					background-color #F56C6C
			.right
				flex 1
				margin-left 5px
				padding-bottom 5px
				border-bottom 1px solid var(--gray2)
				.title
					display flex
					justify-content space-between
					.time
						font-size 24rpx
						color var(--gray2)
				.content
					margin-top 4px
					width calc(100vw - 75px)
					height 20px
					color var(--gray1)
					text-overflow ellipsis
					white-space nowrap
					overflow hidden
					text-overflow ellipsis
			&:last-child .right
				border none
		.system
			background-color var(--origin4)
	.remark
		padding 10px 0
		color var(--gray1)
		font-size 22rpx
</style>
