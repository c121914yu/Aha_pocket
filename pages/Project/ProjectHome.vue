<template>
	<view class="resource-home">
		<!-- 轮播图 -->
		<view class="header">
			<SlideCard></SlideCard>
		</view>
		<!-- 榜单 -->
		<view class="ranking">
			<!-- 类型 -->
			<view class="kind">
				<view class="week" :class="rankType === 'week' ? 'active' : ''" @click="rankType = 'week'">
					<text class="iconfont icon-bangdan"></text>
					<text>每周榜单</text>
				</view>
				<view class="news" :class="rankType === 'news' ? 'active' : ''" @click="rankType = 'news'">
					<text class="iconfont icon-tubiaozuixin01"></text>
					<text>最新推荐</text>
				</view>
			</view>
			<!-- 列表 -->
			<view class="list">
				<projectCard
					v-for="(project, index) in RankingData"
					:key="index"
					:ranking="index + 1"
					:border="index === 2 ? false : true"
					:project="project"
					@click="readProject(project.id)"
				></projectCard>
			</view>
		</view>
		<!-- 比赛推荐 -->
		<view class="recommand">
			<ProjectHead 
				topRadius
				@sortChange="sortChange" 
				@filterChange="filterChange">
			</ProjectHead>
			<!-- 推荐比赛列表 -->
			<view class="list">
				<projectCard
					v-for="(project, index) in arr_projects"
					:key="index"
					margin="0 0 10px 0"
					:radius="index === 0 ? '0 0 16px 16px' : '16px'"
					:project="project"
					isShowAnonymous
					@click="readProject(project.id)"
				></projectCard>
			</view>
		</view>
		<view class="center small remark">{{ is_showAll ? "已加载全部" : "" }}</view>

		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getProjects } from '@/static/request/api_project.js'
import ProjectCard from "./components/ProjectCard.vue"
import ProjectHead from "./components/ProjectHead.vue"
export default {
	data() {
		return {
			rankType: 'week',
			pageNum: 1,
			pageSize: 10,
			sortBy: "read",
			filter: null,
			RankingData: [],
			arr_projects: [],
			is_showAll: false
		};
	},
	components: {
		ProjectHead,
		ProjectCard
	},
	methods: {
		/* 
			name: 获取项目
			desc: 请求项目数据，根据界面条件排序/筛选。传入init参数，判断是否初始化进行操作。
			time: 2020/12/4
		*/
		loadProjects(init=false,loading=true) 
		{
			if (init) {
				this.is_showAll = false
				this.pageNum = 1
			}
			this.gLoading(this, loading)
			let params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortBy
			}
			if(this.filter){
				params[this.filter[0]] = this.filter[1]
			}
			getProjects(params)
			.then(res => {
				if(res.data.pageData.length < this.pageSize){
					this.is_showAll = true
				}
				else{
					this.pageNum++
				}
				if(init){
					this.arr_projects = []
				}
				res.data.pageData.forEach(project => {
					this.arr_projects.push(project)
				})
				
				/* 获取推荐 */
				if(this.arr_projects.length >= 3){
					this.RankingData = [this.arr_projects[0], this.arr_projects[1], this.arr_projects[2]]
				}
				else if(this.arr_projects.length > 0){
					this.RankingData = [].concat(this.arr_projects)
				}
				this.gLoading(this, false)
				console.log(this.arr_projects);
			})
			.catch(err => {
				this.gLoading(this, false)
			})
		},
		/* 
			name: 加载更多数据
			time: 2020/11/30
		*/
		loadMore() 
		{
			if (!this.is_showAll) {
				this.loadProjects(false,false)
			}
		},
		/* 排序发生改变，获取排序字段并重新请求数据 */
		sortChange(e)
		{
			this.sortBy = e.val
			this.loadProjects(true)
		},
		/* 
			name: 确认筛选
			desc: 获取筛选模式，关闭弹窗，请求数据
		*/
	    filterChange(e)
	    {
			this.filter = e
			this.loadProjects(true)
	    },
		/* 进入项目详细 */
		readProject(id) 
		{
			uni.navigateTo({
				url: `Project/Project?id=${id}`
			})
		}
	}
}
</script>

<style lang="stylus">
.resource-home
	// 偏离底部导航距离
	min-height 100vh
	padding-bottom 80px
	background-color var(--white1)
	// 轮播图
	.header
		height 47vw
		background-color var(--origin3)
		border-bottom-left-radius 12px
		border-bottom-right-radius 12px
	/* 榜单 */
	.ranking
		margin 50px auto 0
		width 90%
		.kind
			display flex
			border-radius 22px
			overflow hidden
			background-color var(--origin3)
			view
				flex 1
				padding 10px 0 50px
				color var(--origin2)
				font-weight 600
				font-size 28rpx
				display flex
				align-items center
				justify-content center
				.iconfont
					margin-right 5px
					font-size 32rpx
				&.active
					background-color var(--origin2)
					color #FFFFFF
					border-radius 22px
		.list
			min-height 150px
			transform translateY(-40px)
			background-color #FFFFFF
			border-radius 22px
			overflow hidden
	/* 推荐列表 */
	.recommand
		margin -15px auto 0
		width 90%
	.remark
		color var(--gray2)
</style>
