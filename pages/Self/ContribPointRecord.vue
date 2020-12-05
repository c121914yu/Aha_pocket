<!-- 贡献度记录 -->
<template>
	<view class="contribPoint-record">
		<!-- 搜索 -->
		<view class="search">
			<text class="iconfont icon-sousuo"></text>
			<input type="text" placeholder="输入账单相关信息">
			<text class="search-btn">搜索</text>
		</view>
		<!-- 分类 -->
		<view class="filter">
			<view 
				class="item"
				:class="index === currentType ? 'active' : ''"
				v-for="(item,index) in types"
				:key="index"
				@click="currentType=index">
				{{item.label}}
			</view>
		</view>
		<!-- 记录 -->
		<view class="records">
			<view 
				class="record"
				v-for="(record,index) in records"
				:key="index"
				@click="handleRecord">
				<view class="left">
					<view class="title">{{record.title}}</view>
					<view class="type small">{{record.type}}</view>
					<view class="time small">{{record.time}}</view>
				</view>
				<view class="right point">
					{{record.point > 0 ? `+${record.point}` : record.point}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			types: [
				{label: "全部",val: "all"},
				{label: "项目",val: "all"},
				{label: "外包",val: "all"},
				{label: "竞赛",val: "all"},
			],
			currentType: 0,
			records: [
				{title: "项目通过-发放贡献度",type: "项目", point: 50, time: "2020/12/4 20:05"},
				{title: "项目通过-发放贡献度",type: "项目",point: -30, time: "2020/12/4 20:05"},
				{title: "项目通过-发放贡献度",type: "项目",point: -20, time: "2020/12/4 20:05"},
				{title: "项目通过-发放贡献度",type: "项目",point: 10, time: "2020/12/4 20:05"},
			]
		}
	},
	methods: {
		/* 
			name: handleRecord
			desc: 点击一条记录，展示操作菜单（删除记录，对该账单疑问）
		*/
	   handleRecord()
	   {
		   uni.showActionSheet({
				itemList:["对该账单疑问","删除该账单"],
				success: (res) => {
					if(res.tapIndex === 0){
						console.log("疑问");
					}
					else if(res.tapIndex === 1){
						this.gShowModal("确认删除该贡献度记录?",() => {
							this.gToastSuccess("删除记录")
						})
					}
				}
		   })
	   }
	}
}
</script>

<style lang="stylus" scoped>
.contribPoint-record
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
	/* 筛选 */
	.filter
		padding 10px
		background-color #f6f6f6
		color #000000
		display flex
		justify-content space-around
		.active
			color var(--origin2)
	/* 记录列表 */
	.records
		padding 10px
		.record
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
