<!-- 贡献度记录 -->
<template>
	<view class="orders">
		<!-- 搜索 -->
		<view class="search">
			<text class="iconfont icon-sousuo"></text>
			<input type="text" placeholder="输入账单相关信息">
			<text class="search-btn">搜索</text>
		</view>
		<!-- 记录 -->
		<navigator 
			class="order"
			v-for="(order,index) in orders"
			:key="index"
			:url="'./OrderDetail?id=' + order.id">
			<view class="left">
				<view class="head">
					<text class="type">附件购买</text>
					<text class="hyphen">-</text>
					<text class="name">{{order.project.name}}</text>
				</view>
				<!-- 所购附件名 -->
				<view 
					class="filename"
					v-for="(file,index) in order.orderResources"
					:key="index">
					<text>{{file.resource.name}}</text>
				</view>
				<view class="time small">{{order.createTime}}</view>
			</view>
			<!-- 右侧：花费情况 & 订单状态 -->
			<view class="right">
				<view class="amount">
					{{order.status === 0 ? order.totalCost : `-${order.totalCost}`}}
				</view>
				<view 
					class="status"
					:style="{
						color: order.status === 0 ? 'var(--gray1)' : 'var(--origin2)'
					}">
					{{order.status === 0 ? "已取消" : "已支付"}}
				</view>
			</view>
		</navigator>
		<p class="center small remark">{{is_showAll ? "已加载全部" : ""}}</p>
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getOrders } from "@/static/request/api_order.js"
export default {
	data() {
		return {
			orders: [],
			pageNum: 1,
			pageSize: 15,
			is_showAll: false
		}
	},
	onLoad() {
		this.getOrdersInfo(true,true)
	},
	onReachBottom(){
		if(!this.is_showAll){
			this.getOrdersInfo()
		}
	},
	methods: {
		/* 加载订单 */
		getOrdersInfo(init=false,loading=false)
		{
			this.gLoading(this,loading)
			if(init){
				this.pageNum = 1
			}
			getOrders({
				pageNum: this.pageNum,
				pageSize: this.pageSize
			})
			.then(res => {
				if(res.data.pageData.length < this.pageSize){
					this.is_showAll = true
				}
				else{
					this.pageNum++
				}
				res.data.pageData.forEach(item => {
					item.createTime = this.gformatDate(item.createTime)
					// if(item.payTime){
					// 	item.payTime = this.gformatDate(item.payTime)
					// }
					this.orders.push(item)
				})
				console.log(this.orders)
				this.gLoading(this,false)
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		}
	},
}
</script>

<style lang="stylus" scoped>
.orders
	background-color #FFFFFF
	/* 搜索栏 */
	.search
		padding 10px
		display flex
		align-items center
		.iconfont
			position absolute
			left 20px
			color #808080
		input
			flex 1
			padding 5px 5px 5px 30px
			border 1px solid var(--origin3)
		.search-btn
			margin-left 10px
			font-size 26rpx
	.order
		padding 10px 10px 5px
		border-bottom var(--border2)
		display flex
		.left
			width 50%
			flex 1
			.head
				width 100%
				padding-bottom 5px
				font-size 26rpx
				overflow hidden
				white-space nowrap
				text-overflow ellipsis
				.type
					color var(--origin1)
				.hyphen
					margin 0 3px
			.filename
				position relative
				width 100%
				padding-left 10px
				font-size 24rpx
				color var(--gray1)
				overflow hidden
				white-space nowrap
				text-overflow ellipsis
				&::before
					content ""
					position absolute
					left 0
					top 50%
					transform translateY(-50%)
					width 5px
					height 5px
					border-radius 50%
					background-color var(--gray1)
			.time
				color var(--gray2)
		.right
			padding 0 5px
			white-space nowrap
			display flex
			flex-direction column
			align-items center
			justify-content center
			.amount
				font-size 32rpx
				font-weight 700
				color var(--origin1)
			.status
				margin-top 5px
				font-size 24rpx
	.remark
		padding 10px 0
		color var(--gray2)
</style>
