<!-- 已经购买的项目 -->
<template>
	<view class="purchased-projects">
		<view class="content">
			<!-- 统计 -->
			<view class="statistics">
				<view>
					<view>购买附件数量</view>
					<view class="amount">{{purchaseAmount}}</view>
				</view>
				<view>
					<view>相关项目数量</view>
					<view class="amount">{{purchaseAmount}}</view>
				</view>
				<view>
					<view>花费Aha币</view>
					<view class="amount">{{purchasePoint}}</view>
				</view>
			</view>
			<!-- 排序/筛选模块 -->
			<view class="sort-filter">
				<ProjectHead
					topRadius
					@sortChange="sortChange" 
					@filterChange="filterChange">
				</ProjectHead>
			</view>
			<!-- 项目卡片 -->
			<view class="projects">
				<projectCard 
					v-for="(project,index) in arr_project"
					:key="index"
					border
					:project="project"
					@click="readProject(project.id)">
				</projectCard>
			</view>
			
			<!-- 加载动画 -->
			<Loading ref="loading"></Loading>
		</view>
	</view>
</template>

<script>
import { getPurchased } from "@/static/request/api_userInfo.js"
import { getProject } from "../../static/request/api_project.js"
import ProjectCard from "./components/ProjectCard.vue"
import ProjectHead from "./components/ProjectHead.vue"
export default {
	data() {
		return {
			purchaseAmount: 10,
			purchasePoint: 120,
			arr_projectId: [],
			arr_project: [],
			pageNum: 1,
			pageSize: 20,
			sortBy: "read",
			filter: null,
			is_showAll: false, 
		}
	},
	components: {
		ProjectCard,
		ProjectHead
	},
	onLoad() {
		// this.gUndesign()
		this.loadPurchased()
	},
	methods: {
		/* 获取项目信息并更新到对应下标的数组中 */
		getProject(id,index)
		{
			getProject(id)
			.then(res => {
				this.arr_project[index].project = res.data
				console.log(this.arr_project[index]);
			})
		},
		/* 获取项目，追加到projects中 */
		loadPurchased(init=false)
		{	
			this.gLoading(this,true)
			getPurchased()
			.then(res => {
				console.log(res.data);
				/* 遍历所有附件，将其按项目分组 */
				res.data.forEach(file => {
					const index = this.arr_projectId.indexOf(file.resource.projectId)
					/* 第一次加载到该项目 */
					if(index === -1){
						this.getProject(file.resource.projectId,this.arr_projectId.length)
						this.arr_projectId.push(file.resource.projectId)
						this.arr_project.push({
							files: [file.resource],
							project: null
						})
					}
					else{
						this.arr_project[index].files.push(file.resource)
					}
				})
				this.gLoading(this,false)
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		},
		/* 排序发生改变，获取排序字段并重新请求数据 */
		sortChange(e)
		{
			this.sortBy = e.val
		},
		/* 
			name: 确认筛选
			desc: 获取筛选模式，关闭弹窗，请求数据
		*/
		filterChange(e)
		{
			this.filter = e
			this.loadPurchased(true)
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
		padding 20px 10px 10px
		border-radius 22px
		background-color #FFFFFF
		overflow hidden
		/* 统计数据 */
		.statistics
			display grid
			grid-template-columns repeat(3,1fr)
			text-align center
			font-size 24rpx
			.amount
				color var(--origin2)
				font-size 34rpx
		/* 筛选/排序 */
		.sort-filter
			margin 10px 0
			border-top var(--border2)
			border-bottom var(--border2)
</style>
