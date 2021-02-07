<!-- 贡献度记录 -->
<template>
	<view class="orders">
		<!-- 搜索 -->
		<view class="search">
			<SearchInput placeholder="输入账单相关内容" v-model="searchText"></SearchInput>
		</view>
		<!-- 记录 -->
		<view 
			class="order"
			v-for="(order,index) in orders"
			:key="index"
			@click="orderDetail(order)">
			<view class="left">
				<view class="strong type">{{order.type.label}}</view>
				<view class="small time">{{order.time}}</view>
			</view>
			<view class="right">
				<view class="item">
					<text class="value">{{order.ahaCreditAmount > 0 ? `+${order.ahaCreditAmount}` : order.ahaCreditAmount}}</text>
					<text class="label">Aha币</text>
				</view>
				<view class="item">
					<text class="value">{{order.ahaPointAmount > 0 ? `+${order.ahaPointAmount}` : order.ahaPointAmount}}</text>
					<text class="label">Aha点</text>
				</view>
			</view>
		</view>
		<p class="center small remark">{{is_showAll ? "已加载全部" : ""}}</p>
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getPointOrder,getOrders } from "@/static/request/api_order.js"
export default {
	data() {
		return {
			searchText: "",
			orders: [],
			pageNum: 1,
			pageSize: 10,
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
			getPointOrder({
				pageNum: this.pageNum,
				pageSize: this.pageSize
			})
			.then(res => {
				if(res.data.pageData.length < this.pageSize){
					this.is_showAll = true
				}
				else{
					this.pageNum++
					this.is_showAll = false
				}
				res.data.pageData.forEach(item => {
					// item.createTime = this.gformatDate(item.createTime)
					item.time = this.gformatDate(item.time)
					item.type = getApp().globalData.arr_ordersType.find(type => type.type === item.type)
					this.orders.push(item)
				})
				console.log(this.orders)
				this.gLoading(this,false)
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		},
		/* 查看订单详细 */
		orderDetail(order)
		{
			if(order.type.type === 5){
				uni.navigateTo({
					url: "OrderDetail?id=" + order.externalId
				})
			}
			console.log(order);
		}
	},
}
</script>

<style lang="stylus" scoped>
.orders
	background-color #FFFFFF
	/* 搜索栏 */
	.search
		background-color var(--origin2)
		padding 3px 5%
	.order
		margin 15px 5%
		padding 10px
		line-height 2
		box-shadow var(--shadow2)
		border-radius 8px
		display flex
		align-items center
		.left
			margin-right 10px
			flex 1
			.time
				color var(--gray2)
		.right
			.item
				text-align end
				display flex
				align-items center
				.value
					color var(--origin2)
					font-size 30rpx
				.label
					font-size 26rpx
					color var(--gray1)
	.remark
		padding-bottom 10px
		color var(--gray2)
</style>
