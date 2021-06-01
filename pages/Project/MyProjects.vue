<!-- 
	个人项目管理
	author
-->
<template>
	<view class="my-projects">
		<!-- 头部 -->
		<view class="header">
			<!-- 数据统计 -->
			<view class="data">
				<view style="border-bottom-left-radius: 16px;" class="item amount">
					<view class="title">
						项目总数
						<text class="mini">(<text class="strong">{{checkingAmount}}</text> 个审核中)</text>
					</view>
					<view class="value">{{projects.length}}</view>
				</view>
				<view style="border-bottom-right-radius: 16px;" class="item collect">
					<view class="title">被收藏量</view>
					<view class="value">{{collection}}</view>
				</view>
			</view>
			<!-- 项目排序 & 筛选 -->
			<view class="sorts">
				<view 
					class="sort"
					:class="index === sortActive ? 'active' : ''"
					v-for="(sort,index) in sortList"
					:key="index"
					@click="onclickSort(sort, index)">
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
			<view>
				<project-card
					v-for="(project, index) in projects"
					:key="index"
					margin="10px 0"
					radius="16px"
					isShowStatus
					:project="project"
					@click="onclickProject(project)">
				</project-card>
			</view>
		</view>
		<view class="center mini remark">{{ is_loadAll ? "已加载全部" : "" }}</view>
		<!-- 上传项目 -->
		<btn-bottom @click="upProject">上传项目</btn-bottom>
		<!-- 筛选组件 -->
		<project-filter
			v-show="is_showFileter"
			@close="is_showFileter=false"
			@filterChange="filterChange">
		</project-filter>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getMeProjects, deleteProject } from '@/static/request/api_project.js';
import ProjectCard from "./components/ProjectCard.vue"
import ProjectFilter from "./components/ProjectFilter.vue"
export default {
	components: {
		"project-card": ProjectCard,
		"project-filter": ProjectFilter
	},
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
			is_loadAll: false, 
			is_showFileter: false
		}
	},
	computed: {
		checkingAmount(){
			return this.projects.filter(item => !item.passed).length
		},
		/**
		 * 我的项目获得收藏总数
		 */
		collection(){
			return getApp().globalData.gUserInfo.statistice.totalReceivedCollection
		}
	},
	onShow() {
		this.loadProjects(true,true)
	},
	onPullDownRefresh() {
		this.loadProjects(true,true)
	},
	onReachBottom() {
		if (!this.is_loadAll) {
			this.loadProjects()
		}
	},
	methods: {
	    /**
		 * 分页加载项目
		 */
		loadProjects(init=false,loading=false) 
		{
			this.gLoading(this, loading)
			if (init) {
				this.pageNum = 1
				this.is_loadAll = false
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
				this.projects = init ? res.data.pageData : this.projects.concat(res.data.pageData)
				if(res.data.pageData.length < this.pageSize){
					this.is_loadAll = true
				}
				else{
					this.pageNum++
				}
				console.log(this.projects);
			})
			.finally(() => {
				this.gLoading(this, false)
				uni.stopPullDownRefresh()
			})
		},
	    /**
		 * 点击排序，判断是否重复点击，若不是则重新请求项目
		 * @param { Object } sort 排序内容
		 * @param { Number } index 点击的下标
		 */
		onclickSort(sort, index) 
		{
			if(this.sortActive !== index){
				this.sortActive = index
				this.sortBy = sort.val
				this.loadProjects(true,true)
			}
		},
		/**
		 * 筛选改变，重新请求项目
		 * @param { Object } sort 排序内容
		 * @param { Number } index 点击的下标
		 */
		filterChange(e)
		{
			this.filter = e
			this.is_showFileter = false
			this.loadProjects(true,true)
		},
		/**
		 * 点击上传项目
		 */
		upProject()
		{
			uni.navigateTo({
				url: "./UpProject"
			})
		},
	    /**
		 * 点击项目，调用menu弹窗，可阅读项目或修改项目
		 * @param {Object} project
		 */
		onclickProject(project) 
		{
			/* 如果项目已经通过，不允许删除 */
			const itemList = ["阅读项目", "修改项目"]
			if(!project.passed){
				itemList.push("删除项目")
			}
			this.gMenuPicker(itemList)
			.then(res => {
				switch(res) {
					case "阅读项目": 
						uni.navigateTo({
							url: `./Project?id=${project.id}`
						})
						break
					case "修改项目":
						uni.navigateTo({
							url: `./EditProject?id=${project.id}`
						})
						break
					case "删除项目":
						this.gShowModal('确认删除该项目?', () => {
							const index = this.projects.findIndex(item => item.id === project.id)
							deleteProject(project.id)
							this.projects.splice(index, 1)
							this.gToastMsg('删除成功')
						})
						break
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.my-projects
	min-height 100vh
	background-color var(--white1)
	padding-top 90px
	padding-bottom constant(safe-area-inset-bottom)
	padding-bottom env(safe-area-inset-bottom)
	/* 数据统计 */
	.header
		z-index 10
		position fixed
		top 0
		width 100%
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
		margin-bottom 60px
		color var(--gray2)
</style>
