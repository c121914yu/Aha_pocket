<!-- 外包 -->
<template>
	<view class="epiboly">
		<view class="head">
			<!-- 搜索 -->
			<view class="item search">
				<input type="text" placeholder="搜索外包...">
				<text class="iconfont icon-sousuo"></text>
			</view>
			<!-- 排序 -->
			<view class="item sorts">
				<view 
					class="sort"
					:class="index === sortIndex ? 'active' : ''"
					v-for="(sort,index) in sortList"
					:key="index"
					@click="sortIndex=index">
					{{sort}}
				</view>
			</view>
			<!-- 筛选 -->
			<view class="filters">
				<InputInfo
					title="地点"
					type="select"
					contentWidth="200rpx"
					:range="places"
					v-model="place">
				</InputInfo>
				<InputInfo
					title="工作内容"
					type="select"
					contentWidth="200rpx"
					:range="workContents"
					v-model="workContent">
				</InputInfo>
			</view>
		</view>
		<!-- 外包卡片 -->
		<view class="list">
			<navigator 
				class="item"
				hover-class	="none"
				v-for="(item,index) in Epibolies"
				:key="index"
				url="Epiboly/EpibolyDetail">
				<view class="title strong">{{item.title}}</view>
				<view class="description small">
					<text class="strong">内容描述: </text>{{item.description}}
				</view>
				<view class="info">
					<view class="time">
						<text class="iconfont icon-shalou"></text>
						<text><text class="small">工时:</text>{{item.workTime}}天</text>
					</view>
					<view class="money">
						<text class="iconfont icon-moneynew"></text>
						<text><text class="small">出价:</text>{{item.workReward}}元</text>
					</view>
					<view class="place">
						<text class="iconfont icon-didian"></text>
						<text><text class="small">地点:</text>{{item.place}}</text>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sortList: ["综合","最新发布","工时多","工时少","报价"],
			sortIndex: 0,
			places: [
				{label: "不限",value: 0},
				{label: "远程",value: 1},
				{label: "杭州",value: 2},
				{label: "上海",value: 3},
			],
			place: "不限",
			workContents: [
				{label: "全部",value: 0},
				{label: "前端开发",value: 1},
				{label: "后端开发",value: 2},
				{label: "IOS开发",value: 3},
				{label: "Android开发",value: 4},
				{label: "UI设计",value: 5},
			],
			workContent: "全部",
			Epibolies: [
				{title: "***小程序",description:"大的撒广撒点5广东省十多个ds16g415大嘎达6ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "浙江工业大学",issuer: "****公司"},
				{title: "***网页",description:"大的撒广撒点5广东省十多个ds16g4156ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "远程",issuer: "****公司"},
				{title: "***设计稿",description:"大的撒广撒点5广东省十多个ds16g4156ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "远程",issuer: "****公司"},
				{title: "***设计稿",description:"大的撒广撒点5广东省十多个ds16g4156ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "远程",issuer: "****公司"},
				{title: "***设计稿",description:"大的撒广撒点5广东省十多个ds16g4156ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "远程",issuer: "****公司"},
			]
		}
	}
}
</script>

<style lang="stylus" scoped>
.epiboly
	min-height 100vh
	padding-bottom 150rpx
	background-color var(--white1)
	.head
		background-color #FFFFFF
		padding 10px
		.item
			margin-bottom 10px
		/* 搜索 */
		.search
			position relative
			display flex
			align-items center
			input
				flex 1
				padding-right 50px
				background-color var(--origin3)
			.iconfont
				position absolute
				right 10px
				font-size 34rpx
				color var(--origin1)
		/* 排序 */
		.sorts
			color var(--gray1)
			font-size 26rpx
			display flex
			justify-content space-between
			.active
				color var(--origin2)
				font-weight 700
		/* 工作内容 */
		.filters
			display flex
			justify-content space-around
	/* 外包列表 */
	.list
		margin auto
		width 95%
		.item
			margin 10px 0
			background-color #FFFFFF
			border-radius 8px
			display block
			overflow hidden
			word-break break-all
			.title,.description
				padding 10px
			.strong
				color var(--origin1)
			.title
				background-color var(--origin3)
			.info
				padding 0 10px
				display flex
				flex-wrap wrap
				view
					margin-right 10px
					display flex
					align-items center
					.small
						margin-right 3px
					.iconfont
						font-size 32rpx
				.time
					color var(--origin1)
				.money
					color #e86452
</style>
