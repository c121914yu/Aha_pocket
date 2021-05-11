<!-- 
	通知列表
	author yjl
-->
<template>
	<view class="inform">
		<TopNavs
			:navs="arr_navs"
			padding
			@navChange="changeNav">
		</TopNavs>
		<!-- 通知列表 -->
		<view class="informs">
			<navigator 
				class="item" 
				:class="item.status === 0 ? 'unread' : ''"
				v-for="(item, index) in arr_informs" 
				:key="index" 
				:url="'Inform?id=' + item.id"
				hover-class="none">
				<image :src="item.senderUser.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></image>
				<view class="right">
					<view class="head">
						<text class="title">{{ item.title }}</text>
						<text class="time">{{ item.receiveDate }}</text>
					</view>
					<view class="content" v-html="item.content"></view>
				</view>
			</navigator>
		</view>
		<view v-if="arr_informs.length===0" class="remark center">无通知</view>
		<view v-else class="remark center">{{ is_showAll ? "已加载全部" : "" }}</view>
		<!-- 发送信息 -->
		<BottomBtn
			text="发送私信"
			linkTo="Inform_send">
		</BottomBtn>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getMessages } from '@/static/request/api_userInfo.js';
export default {
	data() {
		return {
			arr_navs: [
				{label: "系统通知",value: "system",amount: 0},
				{label: "用户消息",value: "private",amount: 0},
				// {text: "企业通知",value: "企业通知",amount: 0}
			],
			currentNav: 0,
			pageNum: 1,
			pageSize: 10,
			arr_informs: [],
			is_showAll: false
		}
	},
	onShow() {
		this.loadInforms(true,true)
	},
	onPullDownRefresh() {
		this.loadInforms(true,true)
	},
	onReachBottom() {
		if (!this.is_showAll) {
			this.loadInforms(false,false,false)
		}
	},
	methods: {
		/**
		 * 消息类型切换
		 * @param {Object} nav
		 * @param {Number} index
		 */
		changeNav(nav,index)
		{
			if(index !== this.currentNav){
				this.currentNav = index
				this.loadInforms(true)
			}
		},
		/**
		 * 获取消息列表
		 */
		loadInforms(init=false,count=false,loading=true) 
		{
			this.gLoading(this, loading)
			if(init){
				this.pageNum = 1
			}
			let params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize
			}
			if(!count){
				params.type = this.arr_navs[this.currentNav].value
			}
			/* 清空统计 */
			else{
				this.arr_navs.forEach(item => {
					item.amount = 0
				})
			}
			getMessages(params)
			.then(res => {
				/* 是否加载所有 */
				if(res.data.pageData.length < this.pageSize){
					this.is_showAll = true
				}
				else{
					this.pageNum++
				}
				if(init){
					this.arr_informs = []
				}
				res.data.pageData.forEach(item => {
					if(count){
						/* 统计未读 */
						if(item.status === 0){
							this.arr_navs[item.type].amount++
						}
						/* 只筛选当前类型 */
						if(item.type === this.currentNav){
							item.receiveDate = this.gformatDate(item.receiveDate)
							this.arr_informs.push(item)
						}
					}
					else{
						item.receiveDate = this.gformatDate(item.receiveDate)
						this.arr_informs.push(item)
					}
				})
				console.log(this.arr_informs);
			})
			.finally(() => {
				this.gLoading(this, false)
				uni.stopPullDownRefresh()
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.inform
	background-color var(--white1)
	min-height 100vh
	padding-bottom 60px
	/* 通知列表 */
	.informs
		.item
			margin 10px 5%
			background-color #FFFFFF
			height 50px
			border-radius 50px 16px 16px 50px
			padding 5px
			display flex
			box-shadow var(--shadow2)
			&.unread
				background-color var(--origin4)
			image
				width 50px
				height 50px
				border-radius 50%
			.right
				margin-left 5px
				flex 1
				overflow hidden
				.head
					display flex
					justify-content space-between
					.title
						font-size 24rpx
						color var(--origin1)
						font-weight 700
					.time
						font-size 22rpx
						color var(--gray2)
				.content
					font-size 22rpx
					color var(--gray2)
					line-height 1.2
					padding 5px 15px 10px 0
	.remark
		padding-bottom 10px
		color var(--gray2)
		font-size 22rpx
</style>
