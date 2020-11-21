<!-- 个人项目管理 -->
<template>
	<view class="my-projects">
		<!-- 项目卡片 -->
		<view class="cards">
			<view class="title">
				<text
					:class="index === sortIndex ? 'active' : ''"
					v-for="(sort,index) in sortList"
					:key="sort"
					@click="sortIndex=index">
					{{sort}}
				</text>
				<text class="filter">筛选<text class="iconfont icon-shaixuan"></text></text>
			</view>
			<!-- 推荐比赛列表 -->
			<view>
				<projectCard 
					v-for="(project,index) in projects"
					:key="index"
					margin="0 0 10px 0"
					:radius="index === 0 ? '0 0 22px 22px' : '22px'"
					:project="project"
					@click="projectSetting(project)">
				</projectCard>
			</view>
		</view>
		<view class="center small">{{loadText}}</view>
	</view>
</template>

<script>
import { getProjects,deleteProject } from "@/static/request/api_project.js"
export default {
	data() {
		return {
			sortList: ["综合","收藏量","最新","获奖等级"],
			sortIndex: 0,
			projects: [],
			loadText: "",
			page: {
				pageNum: 1,
				pageSize: 10,
				all: false
			}
		}
	},
	methods: {
		/* 
			name: 初始化项目
			desc: 请求个人项目数据，并重新赋值projects和page
			time: 2020/11/20
		*/
		initProjects()
		{
			this.page = {
				pageNum: 1,
				pageSize: 10,
				all: false
			}
			getProjects(this.page)
			.then(res => {
				this.page.pageNum++
				this.projects = res.data.pageData
				console.log(this.projects)
				uni.stopPullDownRefresh()
			})
			.catch(() => uni.stopPullDownRefresh())
		},
		/* 
			name: 项目设置
			desc: 根据项目id进入项目编辑界面
			time: 2020/11/20
		*/
		projectSetting(project)
		{
			uni.showActionSheet({
				itemList: ["阅读项目", "修改项目", "删除项目"],
				success: (res) => {
					/* 阅读项目，跳转阅读界面 */
					if(res.tapIndex === 0)
						uni.navigateTo({
							url: `Project?id=${project.id}`
						})
					/* 编辑项目，跳转阅读界面 */
					else if(res.tapIndex === 1)
						uni.navigateTo({
							url: `EditProject?id=${project.id}`
						})
					/* 删除项目 */
					else if(res.tapIndex === 2)
						this.gShowModal("确认删除该项目?",() => {
							console.log("删除项目");
							const index = this.projects.indexOf(project)
							deleteProject(project.id)
							.then(res => {
								this.gToastSuccess("删除成功")
								this.projects.splice(index,1)
							})
						})
				}
			})
			
		}
	},
  onLoad() {
		this.initProjects()
  },
	onPullDownRefresh() {
		this.initProjects()
	},
	onReachBottom(){
		if(this.page.all)
			this.loadText = "已加载全部"
		else{
			this.loadText = "加载中..."
			getProjects(this.page)
			.then(res => {
				const data = res.data.pageData
				if(data.length === 0){
					this.page.all = true
					this.loadText = "已加载全部"
				}
				else{
					this.page.pageNum++
					this.projects = this.projects.concat(data)
					this.loadText = ""
				}
			})
			.catch(err => {
				this.loadText = ""
			})
		}
	},
}
</script>

<style lang="stylus" scoped>
.my-projects
	min-height 100vh
	background-color var(--white1)
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
				color var(--origin2)
				display flex
				align-items center
				.iconfont
					font-size 40rpx
		
	.center
		padding 10px
		color var(--gray1)
</style>
