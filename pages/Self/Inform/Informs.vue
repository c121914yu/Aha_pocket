<!-- 通知 -->
<template>
	<view class="inform">
		<view class="navs">
			<view 
				class="nav"
				:class="index === currentNav ? 'active' : ''"
				v-for="(nav,index) in navs"
				:key="index"
				@click="changeNav(index)">
				<text>{{nav.text}}</text>
				<view v-if="nav.unread>0" class="amount">{{nav.unread}}</view>
			</view>
		</view>
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
			navs: [
				{text: "系统通知",value: "system",unread: 0},
				{text: "用户消息",value: "private",unread: 0},
				// {text: "企业通知",value: "企业通知",unread: 0}
			],
			currentNav: 0,
			pageNum: 1,
			pageSize: 30,
			arr_informs: [],
			is_showAll: false
		}
	},
	onShow() {
		this.getMsg(true,true)
	},
	onPullDownRefresh() {
		this.getMsg(true,true)
	},
	onReachBottom() {
		if (!this.is_showAll) {
			this.getMsg(false,false,false)
		}
	},
	methods: {
		/* 获取消息列表 */
		getMsg(init=false,count=false,loading=true) 
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
				params.type = this.navs[this.currentNav].value
			}
			/* 清空统计 */
			else{
				this.navs.forEach(item => {
					item.unread = 0
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
							this.navs[item.type].unread++
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
				uni.stopPullDownRefresh()
				this.gLoading(this, false)
			})
			.catch(err => {
				this.gLoading(this, false)
				uni.stopPullDownRefresh()
			})
		},
		changeNav(index)
		{
			if(index !== this.currentNav){
				this.currentNav = index
				this.getMsg(true)
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.inform
	background-color var(--white1)
	min-height 100vh
	/* 导航 */
	.navs
		margin-bottom 5px
		display flex
		// display grid
		// grid-template-columns repeat(3,1fr)
		border-bottom-left-radius 22px
		border-bottom-right-radius 22px
		overflow hidden
		.nav
			flex 1
			padding 10px 0
			background-color var(--origin3)
			display flex
			align-items center
			justify-content center
			text
				color var(--origin1)
				font-size 26rpx
				font-weight 700
			.amount
				margin-left 5px
				width 16px
				height 16px
				text-align center
				line-height 16px
				font-size 12px
				border-radius 50%
				background-color var(--origin2)
				color #FFFFFF
			&.active
				 background-color var(--origin2)
				 text
					color #FFFFFF
				 .amount
					background-color #FFFFFF
					color var(--origin2)
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
