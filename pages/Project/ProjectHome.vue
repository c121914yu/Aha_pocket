<!-- 
	项目主页
	authro yjl
 -->
<template>
	<view class="resource-home" @touchmove.prevent>
		<!-- 轮播图 -->
		<view class="header">
			<slide-card></slide-card>
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
			<project-head 
				topRadius
				@sortChange="sortChange" 
				@filterChange="filterChange">
			</project-head>
			<!-- 推荐比赛列表 -->
			<view class="list">
				<project-card
					v-for="(project, index) in arr_projects"
					:key="index"
					margin="0 0 10px 0"
					:radius="index === 0 ? '0 0 16px 16px' : '16px'"
					:project="project"
					isShowAnonymous
					@click="readProject(project.id)"
				></project-card>
			</view>
		</view>
		<view class="center small remark">{{ is_loadAll ? "已加载全部" : "" }}</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getProjects } from '@/static/request/api_project.js'
import ProjectCard from "./components/ProjectCard.vue"
import ProjectHead from "./components/ProjectHead.vue"
export default {
	components: {
		"project-head": ProjectHead,
		"project-card": ProjectCard
	},
	data() {
		return {
			rankType: 'week',
			pageNum: 1,
			pageSize: 5,
			sortBy: "read",
			filter: null,
			RankingData: [],
			arr_projects: [],
			is_loadAll: false
		}
	},
	methods: {
	    /**
		 * 加载项目
		 * @param {Boolean}  init 是否初始化
		 * @param {Boolean}  loading 加载动画
		 */
		loadProjects(init=false,loading=false) 
		{
			if (init) {
				this.is_loadAll = false
				this.pageNum = 1
			}
			if(this.is_loadAll) {
				return
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
					this.is_loadAll = true
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
				
				/* 模拟获取推荐 */
				if(this.arr_projects.length >= 3){
					this.RankingData = [this.arr_projects[0], this.arr_projects[1], this.arr_projects[2]]
				}
				else if(this.arr_projects.length > 0){
					this.RankingData = [].concat(this.arr_projects)
				}
				console.log("项目:",this.arr_projects);
			})
			.finally(() => this.gLoading(this, false))
		},
		/**
		 * 排序发生改变，获取排序字段并重新请求数据
		 * @param {Object} e 排序对象
		 */
		sortChange(e)
		{
			this.sortBy = e.val
			this.loadProjects(true,true)
		},
	    /**
		 * 确认筛选模式，关闭弹窗，请求数据
		 * @param {Object} e
		 */
	    filterChange(e)
	    {
			this.filter = e
			this.loadProjects(true,true)
	    },
		/**
		 * 进入项目详细
		 */
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
	padding-bottom constant(safe-area-inset-bottom)
	padding-bottom env(safe-area-inset-bottom)
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
			.week, .news
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
