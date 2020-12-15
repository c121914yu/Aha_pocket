<!-- 个人项目管理 -->
<template>
	<view class="my-projects">
		<!-- 数据统计 -->
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
			<view class="title">
				<text 
					:class="index === sortIndex ? 'active' : ''" 
					v-for="(sort, index) in sortList" 
					:key="sort"
					@click="sortIndex=index;loadProjects(true)">
					{{ sort.text }}
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
			<!-- 推荐比赛列表 -->
			<view>
				<projectCard
					v-for="(project, index) in projects"
					:key="index"
					margin="0 0 10px 0"
					:radius="index === 0 ? '0 0 16px 16px' : '16px'"
					:backgroundColor="project.passed ? '#ffffff' : 'rgba(248,184,107,0.1)'"
					:project="project"
					@click="projectSetting(project)"
				></projectCard>
			</view>
		</view>
		<view class="center small">{{ loadText }}</view>
		
		<!-- 筛选组件 -->
		<ProjectFilter v-if="isFilter" @sureFilter="sureFilter"></ProjectFilter>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getMeProjects, deleteProject } from '@/static/request/api_project.js';
export default {
	data() {
		return {
			couldSet: true,
			sortList: [
				{ text: '综合', val: 'read' }, 
				{ text: '收藏量', val: 'collect' }, 
				{ text: '最新', val: 'time' }, 
				{ text: '获奖等级', val: 'awardLevel' },
			],
			sortIndex: 0,
			projects: [],
			pageNum: 1,
			pageSize: 10,
			compId: null,
			awardLevel: null,
			showStatus: 0, //0未加载完成，1加载全部，2加载中,3 无数据
			isFilter: false,
			filterActive: false,
		};
	},
	computed: {
		loadText() {
			switch (this.showStatus) {
				case 0: return ''
				case 1: return '已加载全部'
				case 2: return '加载中...'
				case 3: return '没有相关数据'
			}
		}
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
		/*
			name: 获取项目
			desc: 请求项目数据，根据界面条件排序/筛选。传入init参数，判断是否初始化进行操作。
			time: 2020/12/4
		*/
		loadProjects(init=false,loading=true) 
		{
			if (init) {
				this.pageNum = 1
			}
			this.gLoading(this, loading)
			let params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortList[this.sortIndex].val
			}
			if(this.compId !== null)
				params.compId = this.compId
			if(this.awardLevel!== null)
				params.awardLevel = this.awardLevel
			getMeProjects(params)
			.then(res => {
				this.projects = init ? res.data.pageData : this.projects.concat(res.data.pageData)
				this.judgeLoadAll(res.data.pageSize)
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
			name: 确认筛选
			desc: 获取筛选模式，关闭弹窗，请求数据
		*/
		sureFilter(e)
		{
		    if(e.type === "all")
				this.filterActive = false
			else
				this.filterActive = true
			this.compId = null
			this.awardLevel = null
		   
			this[e.type] = e.value
			this.loadProjects(true)
			this.isFilter = false
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
				uni.showActionSheet({
					itemList: ['阅读项目', '修改项目', '删除项目'],
					success: res => {
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
	onLoad(e) {
		this.loadProjects(true)
	},
	onPullDownRefresh() {
		this.loadProjects(true)
	},
	onReachBottom() {
		if (this.showStatus === 0) {
			this.showStatus = 2
			this.loadProjects(false,false)
		}
	}
}
</script>

<style lang="stylus" scoped>
.my-projects
	min-height 100vh
	background-color var(--white1)
	/* 上传项目按键 */
	.up-project
		z-index 5
		position fixed
		right 10px
		bottom 5vh
		.iconfont
			font-size 30px
			color var(--origin1)
	.cards
		width 90%
		margin 0 auto
		// 开头标题
		.title
			padding 20rpx 30rpx
			background-color var(--white2)
			border-top-left-radius 22px
			border-top-right-radius 22px
			font-size 28rpx
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
	.center
		padding 10px
		color var(--gray1)
</style>
