<!-- 个人项目管理 -->
<template>
	<view class="my-projects">
		<!-- 数据统计 -->
		<navigator 
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
					v-for="(sort,index) in sortList"
					:key="sort"
					@click="sortIndex=index">
					{{sort.text}}
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
        <!-- 加载动画 -->
        <Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getProjects,deleteProject } from "@/static/request/api_project.js"
export default {
	data() {
		return {
			userId: "",
			couldSet: true,
			sortList: [
				{text: "综合",val: "read"},
				{text: "收藏量",val: "collect"},
				{text: "最新",val: "time"},
				{text: "获奖等级",val: "awardLevel"},
			],
			sortIndex: 0,
			projects: [],
			pageNum: 1,
			pageSize: 20,
			showStatus: 0 //0未加载完成，1加载全部，2加载中
		}
	},
	watch:{
		sortIndex: "initProjects"
	},
	computed: {
		loadText(){
			switch(this.showStatus){
				case 0: return ""
				case 1: return "已加载全部"
				case 2: return "加载中..."
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
            this.gLoading(this,true)
			this.pageNum = 1
			getProjects({
				userId: this.userId,
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortList[this.sortIndex].val
			})
			.then(res => {
				this.projects = res.data.pageData
				if(res.data.pageSize < this.pageSize)
					this.showStatus = 1
				else
					this.page.pageNum++
				uni.stopPullDownRefresh()
                this.gLoading(this,false)
			})
			.catch(() => {
                uni.stopPullDownRefresh()
                this.gLoading(this,false)
            })
		},
		/* 
			name: 项目设置
			desc: 根据项目id进入项目编辑界面
			time: 2020/11/20
		*/
		projectSetting(project)
		{
			/* 如果是查看其他人项目，直接进入阅读 */
			if(!this.couldSet)
				uni.navigateTo({
					url: `Project?id=${project.id}`
				})
			else{
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
						else if(res.tapIndex === 2){
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
					}
				})
			}
		}
	},
    onLoad(e) {
		if(e.userId){
			this.userId = e.userId
			this.couldSet = false
			uni.setNavigationBarTitle({
				title: "用户项目列表"
			})
		}
		else{
			this.userId = getApp().globalData.gUserInfo.userInfo.userId
			uni.setNavigationBarTitle({
				title: "我的项目"
			})
		}
		this.initProjects()
    },
	onPullDownRefresh() {
		this.initProjects()
	},
	onReachBottom(){
		if(this.showStatus === 0){
			this.showStatus = 2
			getProjects({
				userId: this.userId,
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortList[this.sortIndex].val
			})
			.then(res => {
				const data = res.data.pageData
				this.projects = this.projects.concat(data)
				if(res.data.pageSize < this.pageSize)
					this.showStatus = 1
				else{
					this.page.pageNum++
					this.showStatus = 0
				}
			})
			.catch(err => {
				this.showStatus = 0
			})
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
				color var(--origin2)
				display flex
				align-items center
				.iconfont
					font-size 40rpx
		
	.center
		padding 10px
		color var(--gray1)
</style>
