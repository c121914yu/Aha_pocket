<!-- 个人项目管理 -->
<template>
	<view class="my-projects">
		<!-- 头部 -->
		<view class="header">
			<!-- 数据统计 -->
			<view class="data">
				<view style="border-bottom-left-radius: 16px;" class="item amount">
					<view class="title">
						项目总数
						<text class="mini">(<text class="strong">{{checkAmount}}</text> 个审核中)</text>
					</view>
					<view class="value">{{projects.length}}</view>
				</view>
				<view style="border-bottom-right-radius: 16px;" class="item collect">
					<view class="title">被收藏量</view>
					<view class="value">{{collection}}</view>
				</view>
			</view>
			<!-- 导航 -->
			<view class="sorts">
				<view 
					class="sort"
					:class="index === sortActive ? 'active' : ''"
					v-for="(sort,index) in sortList"
					:key="index"
					@click="checkSort(sort, index)">
					{{sort.text}}
				</view>
				<view 
					:style="{
						color: filter ? 'var(--origin2)' : ''
					}"
					class="iconfont icon-shaixuan"
					@click="is_showFileter=true">
				</view>
			</view>
		</view>
		<!-- 项目卡片 -->
		<view class="cards">
			<!-- 推荐比赛列表 -->
			<view>
				<projectCard
					v-for="(project, index) in projects"
					:key="index"
					margin="10px 0"
					radius="16px"
					is_showStatus
					:project="project"
					@click="projectSetting(project)"
				></projectCard>
			</view>
		</view>
		<view class="center mini remark">{{ is_showAll ? "已加载全部" : "" }}</view>
		<!-- 上传项目 -->
		<BottomBtn
			text="上传项目"
			@click="upProject">
		</BottomBtn>
		<!-- 筛选组件 -->
		<ProjectFilter
			v-if="is_showFileter"
			@close="is_showFileter=false"
			@filterChange="filterChange">
		</ProjectFilter>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getMeProjects, deleteProject } from '@/static/request/api_project.js';
import ProjectCard from "./components/ProjectCard.vue"
import ProjectFilter from "./components/ProjectFilter.vue"
export default {
	data() {
		return {
			sortList: [
				{ text: '综合', val: 'read' }, 
				{ text: '收藏量', val: 'collect' }, 
				{ text: '最新', val: 'time' }, 
				{ text: '获奖等级', val: 'awardLevel' },
			],
			sortActive: 0,
			
			projects: [],
			pageNum: 1,
			pageSize: 15,
			sortBy: "read",
			filter: null,
			is_showAll: false, 
			is_showFileter: false
		}
	},
	computed: {
		checkAmount(){
			return this.projects.filter(item => !item.passed).length
		},
		collection(){
			return getApp().globalData.gUserInfo.statistice.totalReceivedCollection
		}
	},
	components: {
		ProjectCard,
		ProjectFilter
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
		/*
			name: 确定排序模式
			time: 2020/12/26
		*/
		checkSort(sort, index) 
		{
			this.sortActive = index
			this.sortBy = sort.val
			this.loadProjects(true)
		},
		filterChange(e)
		{
			this.filter = e
			this.loadProjects(true)
			this.is_showFileter = false
		},
		/* 上传项目,选择web或者小程序 */
		upProject()
		{
			uni.showActionSheet({
				itemList: ["小程序上传","电脑上传"],
				success: (res) => {
					if(res.tapIndex === 0){
						uni.navigateTo({
							url: "UpProject"
						})
					}
					else {
						this.gToastMsg("已复制连接,请使用电脑浏览器打开!")
					}
				}
			})
		},
		/* 
			name: 项目设置
			desc: 根据项目id进入项目编辑界面
			time: 2020/11/20
		*/
		projectSetting(project) 
		{
			/* 如果项目已经通过，不允许删除 */
			const itemList = ["阅读项目", "小程序修改项目","电脑修改项目"]
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
					/* PC编辑项目，跳转阅读界面 */
					else if (res.tapIndex === 2){
						this.gToastMsg("已复制连接,请使用电脑浏览器打开!")
					}
					/* 删除项目 */ 
					else if (res.tapIndex === 3) {
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
			})
		}
	},
}
</script>

<style lang="stylus" scoped>
.my-projects
	min-height 100vh
	background-color var(--white1)
	padding-bottom 55px
	/* 数据统计 */
	.header
		margin-bottom 10px
		padding 5px
		font-size 24rpx
		background-color #FFFFFF
		border-bottom-left-radius 16px
		border-bottom-right-radius 16px
		.data
			text-align center
			display grid
			grid-template-columns 1fr 1fr
			grid-gap 5px
			.item
				padding 5px
				background-color var(--origin3)
				.title
					color var(--gray1)
				.value
					margin auto
					width 30%
					color var(--origin2)
					background-color #FFFFFF
					border-radius 22px
					font-size 26rpx
					font-weight 700
		.sorts
			margin-top 5px
			width 100%
			display flex
			align-items center
			.sort
				margin-right 5px
				flex 1
				background-color var(--origin4)
				color var(--origin1)
				padding 5px
				border-radius 22px
				text-align center
				font-weight 700
				&.active
					color #FFFFFF
					background-color var(--origin2)
			.iconfont
				padding 0 10px 0 5px
				font-size 30rpx
	.cards
		width 90%
		margin auto
	.remark
		color var(--gray2)
</style>
