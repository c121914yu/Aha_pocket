<!-- 个人项目管理 -->
<template>
	<view class="my-projects">
		<!-- 数据统计 -->
		<view class="data">
			<view class="amount">
				<view class="title">
					项目总数
					<text class="mini">(<text class="strong">{{checkAmount}}</text> 个审核中)</text>
				</view>
				<view class="h3">{{projects.length}}</view>
			</view>
			<view class="collect">
				<view class="title">被收藏量</view>
				<view class="h3">{{collection}}</view>
			</view>
		</view>
		<!-- 上传项目 -->
		<navigator 
			v-if="couldSet" 
			class="up-project" 
			hover-class="none" 
			url="UpProject">
			<text class="iconfont icon-add-fill"></text>
		</navigator>
		<!-- 项目卡片 -->
		<view class="cards">
			<ProjectHead
				topRadius
				@sortChange="sortChange" 
				@filterChange="filterChange">
			</ProjectHead>
			<!-- 推荐比赛列表 -->
			<view>
				<projectCard
					v-for="(project, index) in projects"
					:key="index"
					margin="0 0 10px 0"
					:radius="index === 0 ? '0 0 16px 16px' : '16px'"
					:backgroundColor="project.passed ? '#ffffff' : 'rgba(248,184,107,0.2)'"
					:project="project"
					@click="projectSetting(project)"
				></projectCard>
			</view>
		</view>
		<view class="center small remark">{{ is_showAll ? "已加载全部" : "" }}</view>
		
		<!-- 筛选组件 -->
		<ProjectFilter v-if="isFilter" @sureFilter="sureFilter"></ProjectFilter>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getMeProjects, deleteProject } from '@/static/request/api_project.js';
import ProjectCard from "./components/ProjectCard.vue"
import ProjectHead from "./components/ProjectHead.vue"
export default {
	data() {
		return {
			couldSet: true,
			projects: [],
			pageNum: 1,
			pageSize: 100,
			sortBy: "read",
			filter: null,
			is_showAll: false, 
		}
	},
	computed: {
		checkAmount(){
			return this.projects.filter(item => !item.passed).length
		},
		collection(){
			let collection = 0
			this.projects.forEach(item => {
				collection += item.collect
			})
			return collection
		}
	},
	components: {
		ProjectHead,
		ProjectCard
	},
	onShow() {
		this.loadProjects(true)
	},
	onPullDownRefresh() {
		this.loadProjects(true)
	},
	onReachBottom() {
		if (!this.is_showAll) {
			this.loadProjects(false,false)
		}
	},
	methods: {
		/*
			name: 获取项目
			desc: 请求项目数据，根据界面条件排序/筛选。传入init参数，判断是否初始化进行操作。
			time: 2020/12/4
		*/
		loadProjects(init=false,loading=true) 
		{
			this.gLoading(this, loading)
			if (init) {
				this.pageNum = 1
			}
			let params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortBy
			}
			if(this.filter){
				params[this.filter[0]] = this.filter[1]
			}
			getMeProjects(params)
			.then(res => {
				if(res.data.pageData.length < this.pageSize){
					this.is_showAll = true
				}
				else{
					this.pageNum++
				}
				this.projects = init ? res.data.pageData : this.projects.concat(res.data.pageData)
				this.gLoading(this, false)
				uni.stopPullDownRefresh()
				console.log(this.projects);
			})
			.catch(err => {
				this.gLoading(this, false)
				uni.stopPullDownRefresh()
			})
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
		/* 
			name: 项目设置
			desc: 根据项目id进入项目编辑界面
			time: 2020/11/20
		*/
		projectSetting(project) 
		{
			/* 如果是查看其他人项目，直接进入阅读 */
			if (!this.couldSet){
				uni.navigateTo({
					url: `Project?id=${project.id}`
				})
			}
			else {
				/* 如果项目已经通过，不允许删除 */
				const itemList = ["阅读项目", "修改项目"]
				if(!project.passed){
					itemList.push("删除项目")
				}
				uni.showActionSheet({
					itemList,
					success: (res) => {
						/* 阅读项目，跳转阅读界面 */
						if (res.tapIndex === 0){
							uni.navigateTo({
								url: `Project?id=${project.id}`
							})
						}
						/* 编辑项目，跳转阅读界面 */ 
						else if (res.tapIndex === 1){
							uni.navigateTo({
								url: `EditProject?id=${project.id}`
							})
						}
						/* 删除项目 */ 
						else if (res.tapIndex === 2) {
							this.gShowModal('确认删除该项目?', () => {
								console.log('删除项目');
								const index = this.projects.indexOf(project);
								deleteProject(project.id).then(res => {
									this.gToastSuccess('删除成功');
									this.projects.splice(index, 1);
								})
							})
						}
					}
				});
			}
		}
	},
}
</script>

<style lang="stylus" scoped>
.my-projects
	min-height 100vh
	background-color var(--white1)
	/* 数据统计 */
	.data
		display grid
		grid-template-columns 1fr 1fr
		text-align center
		padding 5px
		font-size 26rpx
		background-color var(--origin3)
		border-bottom-left-radius 44px
		border-bottom-right-radius 44px
		.h3
			color var(--origin1)
		.amount
			border-right var(--border1)
	/* 上传项目按键 */
	.up-project
		z-index 5
		position fixed
		right 10px
		bottom 5vh
		.iconfont
			font-size 70rpx
			color var(--origin1)
	.cards
		width 90%
		margin 0 auto
	.remark
		padding 10px
		color var(--gray1)
</style>
