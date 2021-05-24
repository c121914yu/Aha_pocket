<!-- 
	通知列表
	author yjl
-->
<template>
	<view class="inform">
		<view class="top-nav">
			<top-navs
				:navs="arr_navs"
				padding
				@navChange="changeNav">
			</top-navs>
		</view>
		<!-- 通知列表 -->
		<view class="informs">
			<view 
				class="item" 
				:class="item.status === 0 ? 'unread' : ''"
				v-for="(item, index) in arr_informs" 
				:key="index"
				@click="onclickInform(index)">
				<image :src="item.senderUser.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></image>
				<view class="right">
					<view class="head">
						<text class="title">{{ item.title }}</text>
						<text class="time">{{ gformatDate(item.receiveDate) }}</text>
					</view>
					<view class="content">
						<rich-text :nodes="item.content"></rich-text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="arr_informs.length===0" class="remark center">无通知</view>
		<view v-else class="remark center">{{ is_loadAll ? "已加载全部" : "" }}</view>
		<!-- 发送信息 -->
		<btn-bottom
			text="发送私信"
			linkTo="Inform_send">
		</btn-bottom>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
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
			is_loadAll: false
		}
	},
	onLoad() {
		this.firstLoad()
	},
	onPullDownRefresh() {
		this.firstLoad()
	},
	onReachBottom() {
		if (!this.is_loadAll) {
			this.loadInforms()
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
				this.firstLoad()
			}
		},
		/**
		 * 首次加载，全部类型都加载一次，统计未读
		 */
		firstLoad()
		{
			this.gLoading(this,true)
			this.is_loadAll = false
			this.pageNum = 1
			Promise.all(this.arr_navs.map(item => getMessages({
				pageNum: 1,
				pageSize: 10,
				type: item.value
			})))
			.then(res => {
				this.arr_informs = res[this.currentNav].data.pageData
				/* 统计数据 */
				res.forEach((item,i) => {
					item = item.data.pageData.filter(inform => inform.status === 0)
					this.arr_navs[i].amount = item.length
				})
			})
			.finally(() => {
				this.gLoading(this,false)
				uni.stopPullDownRefresh()
			})
		},
		/**
		 * 获取消息列表
		 */
		loadInforms() 
		{
			getMessages({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				type: this.arr_navs[this.currentNav].value
			})
			.then(res => {
				/* 是否加载所有 */
				if(res.data.pageData.length < this.pageSize){
					this.is_loadAll = true
				}
				else{
					this.pageNum++
				}
				res.data.pageData.forEach(item => {
					/* 统计未读 */
					if(item.status === 0){
						this.arr_navs[item.type].amount++
					}
					this.arr_informs.push(item)
				})
				console.log(this.arr_informs);
			})
		},
		/**
		 * 点击通知，跳转通知详细。判断是否是未读信息，如果是则更新下状态
		 * @param {Object} i
		 */
		onclickInform(i) 
		{
			const inform = this.arr_informs[i]
			uni.navigateTo({
				url: `Inform?id=${inform.id}`,
				success: () => {
					if(inform.status === 0) {
						this.arr_informs[i].status = 1
						this.arr_navs[this.currentNav].amount--
					}
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.inform
	background-color var(--white1)
	min-height 100vh
	padding 52px 0 60px
	.top-nav
		position fixed
		top 0
		width 100%
	/* 通知列表 */
	.informs
		.item
			margin 10px 5%
			background-color #FFFFFF
			height 60px
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
