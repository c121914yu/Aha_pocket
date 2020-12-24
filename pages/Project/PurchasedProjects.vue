<!-- 已经购买的项目 -->
<template>
	<view class="purchased-projects">
		<view class="content">
			<!-- 统计 -->
			<view class="statistics">
				<view class="purchase-amount">
					<view>购买项目数量</view>
					<view class="amount">{{purchaseAmount}}</view>
				</view>
				<view class="purchase-amount">
					<view>花费贡献度</view>
					<view class="amount">{{purchasePoint}}</view>
				</view>
			</view>
			<!-- 排序/筛选模块 -->
			<view class="sort-filter">
				<text
					:class="index === sortIndex ? 'active' : ''"
					v-for="(sort,index) in sortList"
					:key="sort"
					@click="sortIndex=index;loadProjects(true)">
					{{sort.label}}
				</text>
				<text
					class="filter"
					:style="{
						color: filterActive ? 'var(--origin2)' : ''
					}"
					@click="isFilter = true">
					筛选
					<text class="iconfont icon-shaixuan"></text>
				</text>
			</view>
			<!-- 项目卡片 -->
			<view class="projects">
				<projectCard 
					v-for="(project,index) in projects"
					:key="index"
					border
					:project="project"
					@click="readProject(project.id)">
				</projectCard>
			</view>
			
			<!-- 筛选组件 -->
			<ProjectFilter v-if="isFilter" @sureFilter="sureFilter"></ProjectFilter>
			<!-- 加载动画 -->
			<Loading ref="loading"></Loading>
		</view>
	</view>
</template>

<script>
import { getPurchasedProject } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			purchaseAmount: 10,
			purchasePoint: 120,
			projects: [],
			sortList: [
				{label: "综合",val: "read"},
				{label: "收藏量",val: "collect"},
				{label: "最新",val: "time"},
				{label: "获奖等级",val: "awardLevel"},
			],
			sortIndex: 0,
			pageNum: 1,
			pageSize: 20,
			compId: null,
			awardLevel: null,
			is_showAll: 0, //0未加载完成，1加载全部，2加载中,3 无数据
			isFilter: false,
			filterActive: false,
		}
	},
	onLoad() {
		this.loadProjects()
	},
	methods: {
		/* 判断是否加载全部 */
		judgeLoadAll(size)
		{
			this.showStatus = 0
			if(size < this.pageSize)
				this.showStatus = 1
			else
				this.pageNum++
			if(this.projects.length === 0)
				this.showStatus = 3
		},
		/* 获取项目，追加到projects中 */
		loadProjects(init=false)
		{	
			this.gLoading(this,true)
			getPurchasedProject()
			.then(res => {
				console.log(res.data);
				this.gLoading(this,false)
			})
		},
		/*
			name: 确认筛选
			desc: 获取筛选模式，关闭弹窗，请求数据
		*/
		sureFilter(e)
		{
		    if(e.type === "all"){
				this.filterActive = false
			}
			else{
				this.filterActive = true
			}
			this.compId = null
			this.awardLevel = null
		   
			this[e.type] = e.value
			this.loadProjects(true)
			this.isFilter = false
		},
		/* 阅读项目 */
		readProject(id) 
		{
			uni.navigateTo({
				url: `Project?id=${id}`
			});
		}
	}
}
</script>

<style lang="stylus" scoped>
.purchased-projects
	background-color var(--white1)
	min-height 100vh
	padding 10px 5%
	.content
		padding 10px
		border-radius 22px
		background-color #FFFFFF
		overflow hidden
		/* 统计数据 */
		.statistics
			display grid
			grid-template-columns 1fr 1fr
			text-align center
			.amount
				color var(--origin2)
				font-size 36rpx
		/* 筛选/排序 */
		.sort-filter
			margin 5px 0
			padding 5px
			background-color var(--white2)
			font-size 26rpx
			border-top var(--border2)
			border-bottom var(--border2)
			display flex
			align-items center
			justify-content space-between
			/* 选中状态 */
			.active
				color var(--origin2)
				font-weight 700
			/* 筛选按键 */
			.filter
				display flex
				align-items center
				.iconfont
					font-size 40rpx
</style>
