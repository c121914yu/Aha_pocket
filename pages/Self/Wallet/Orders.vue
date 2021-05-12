<!-- 
	贡献度记录
	author yjl
-->
<template>
	<view class="orders">
		<!-- 搜索 -->
		<view class="search">
			<search-input placeholder="输入账单相关内容" v-model="searchText"></search-input>
		</view>
		<!-- 货币流水 -->
		<view 
			class="order"
			v-for="order in arr_orders"
			:key="order.id"
			@click="onclickOrder(order)">
			<view class="left">
				<view class="strong type">{{order.type.label}}</view>
				<view class="small time">{{order.time}}</view>
			</view>
			<view class="right">
				<view class="item">
					<text class="value">{{order.ahaCreditAmount | numberToStr}}</text>
					<text class="label">Aha币</text>
				</view>
				<view class="item">
					<text class="value">{{order.ahaPointAmount | numberToStr}}</text>
					<text class="label">Aha点</text>
				</view>
			</view>
		</view>
		<p class="center small remark">{{is_showAll ? "已加载全部" : ""}}</p>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getPointOrder,getOrders } from "@/static/request/api_order.js"
export default {
	data() {
		return {
			searchText: "",
			arr_orders: [],
			pageNum: 1,
			pageSize: 10,
			is_showAll: false
		}
	},
	filters: {
		/**
		 * 数字格式化，前面添加加号或减号
		 * @param {Number} val
		 */
		numberToStr(val) {
			if(val > 0){
				return `+${val}`
			}
			return val
		}
	},
	onLoad() {
		this.loadOrders(true,true)
	},
	onReachBottom(){
		if(!this.is_showAll){
			this.loadOrders()
		}
	},
	methods: {
		/**
		 * 加载订单
		 * @param {Boolean}  init 是否初始化订单（从0开始请求）
		 * @param {Boolean}  loading  是否展示加载动画
		 */
		loadOrders(init=false,loading=false)
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
					item.time = this.gformatDate(item.time)
					/* 获取订单类型 */
					item.type = getApp().globalData.garr_ordersType.find(type => type.type === item.type)
					this.arr_orders.push(item)
				})
				console.log(this.arr_orders)
				this.gLoading(this,false)
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		},
		/**
		 * 查看订单详细，判断订单类型，部分是可以跳转到详细
		 * @param {Object} order 订单对象
		 */
		onclickOrder(order)
		{
			if(order.type.type === 5){
				uni.navigateTo({
					url: "OrderDetail?id=" + order.externalId
				})
			}
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
			display flex
			flex-direction column
			align-items flex-end
			.item
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
