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
				<view class="title">{{order.title}}</view>
				<view class="type small">项目</view>
				<view class="time small">{{order.createTime}}</view>
			</view>
			<view class="right price">
				{{order.price > 0 ? `+${order.price}` : order.price}}
			</view>
		</navigator>
		<!-- <p class="center small remark">{{is_showAll ? "已加载全部" : ""}}</p> -->
	</view>
</template>

<script>
import { getOrders } from "@/static/request/api_order.js"
export default {
	data() {
		return {
			orders: [],
			type: 0,
			pageNum: 1,
			pageSize: 20,
			is_showAll: true
		}
	},
	onLoad() {
		this.getOrdersInfo(true)
	},
	methods: {
		/* 判断是否加载全部 */
		judgeLoadAll(size)
		{
			if(size < this.pageSize){
				this.is_showAll = true
			}
			else{
				this.pageNum++
			}
		},
		/* 加载订单 */
		getOrdersInfo(init=false)
		{
			if(init){
				this.pageNum = 1
			}
			getOrders()
			.then(res => {
				// this.judgeLoadAll(res.data.pageData.length)
				res.data.forEach(item => {
					item.createTime = this.gformatDate(item.createTime)
					this.orders.push(item)
				})
				console.log(this.orders[0]);
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
		padding 10px
		border-bottom var(--border2)
		display flex
		.left
			flex 1
		.small
			color var(--gray2)
		.price
			font-size 36rpx
			color var(--origin1)
			font-weight 700
	.remark
		margin-top 10px
		color var(--gray2)
</style>
