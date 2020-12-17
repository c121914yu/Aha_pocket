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
				<view class="type small">{{order.type}}</view>
				<view class="time small">{{order.time}}</view>
			</view>
			<view class="right point">
				{{order.point > 0 ? `+${order.point}` : order.point}}
			</view>
		</navigator>
	</view>
</template>

<script>
import { getOrders } from "@/static/request/api_order.js"
export default {
	data() {
		return {
			orders: [
				{id: 0,title: "项目通过-发放贡献度",type: "项目", point: 50, time: "2020/12/4 20:05"},
				{id: 1,title: "项目通过-发放贡献度",type: "项目",point: -30, time: "2020/12/4 20:05"},
				{id: 2,title: "项目通过-发放贡献度",type: "项目",point: -20, time: "2020/12/4 20:05"},
				{id: 3,title: "项目通过-发放贡献度",type: "项目",point: 10, time: "2020/12/4 20:05"},
			],
			type: 0,
			pageNum: 1,
			pageSize: 20,
			loadStatus: 0, // 0未加载完成，1加载中，2加载全部
		}
	},
	onLoad() {
		this.getOrdersInfo(true)
	},
	methods: {
		/* 判断是否加载全部 */
		judgeLoadAll(size)
		{
			if(size < this.pageSize)
				this.loadStatus = 3
			else{
				this.loadStatus = 0
				this.pageNum++
			}
		},
		/* 加载订单 */
		getOrdersInfo(init=false)
		{
			this.loadStatus = 1
			if(init){
				this.pageNum = 1
			}
			getOrders()
			.then(res => {
				this.judgeLoadAll(res.data.pageSize)
				this.orders = init ? res.data.pageData : this.orders.concat(res.data.pageData)
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
		.point
			font-size 36rpx
			color var(--origin1)
			font-weight 700
</style>
