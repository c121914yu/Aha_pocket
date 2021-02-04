<!-- 贡献度记录 -->
<template>
	<view class="orders">
		<!-- 搜索 -->
		<view class="search">
			<SearchInput placeholder="输入账单相关内容" v-model="searchText"></SearchInput>
		</view>
		<!-- 记录 -->
		<navigator 
			class="order"
			v-for="(order,index) in orders"
			:key="index"
			:url="'./OrderDetail?id=' + order.id">
			<view class="title">
				附件购买-{{order.project.name}}
			</view>
			<view class="content">
				<view class="left">
					<!-- 所购附件名 -->
					<view 
						class="filename"
						v-for="(file,index) in order.orderResources"
						:key="index">
						<text>{{file.resource.name}}</text>
					</view>
					<view class="time">{{order.createTime}}</view>
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
			</view>
		</navigator>
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
			pageSize: 15,
			is_showAll: false
		}
	},
	onLoad() {
		this.getOrdersInfo(true,true)
		getPointOrder()
		.then(res => {
			console.log(res);
		})
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
		background-color var(--origin2)
		padding 3px 5%
	.order
		margin 10px 5%
		box-shadow var(--shadow2)
		border-radius 16px
		display block
		overflow hidden
		.title
			padding 8px 10px
			background-color var(--origin3)
			font-size 24rpx
			font-weight 700
			color #FFFFFF
		.content
			padding 5px 10px
			display flex
			.left
				flex 1
				max-width calc(100% - 50px)
			.filename
				position relative
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
					background-color var(--origin1)
			.time
				color var(--gray2)
				font-size 22rpx
			.right
				padding-left 10px
				white-space nowrap
				display flex
				flex-direction column
				align-items center
				justify-content center
				.amount
					font-size 30rpx
					font-weight 700
					color var(--origin1)
				.status
					font-size 22rpx
	.remark
		padding-bottom 10px
		color var(--gray2)
</style>
