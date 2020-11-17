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
					:project="project"
					margin="0 0 10px 0"
					:radius="index === 0 ? '0 0 22px 22px' : '22px'"
					@click="projectSetting(project)">
				</projectCard>
			</view>
		</view>
	</view>
</template>

<script>
import { getProjects } from "@/static/request/api_project.js"
export default {
	data() {
		return {
			sortList: ["综合","收藏量","最新","获奖等级"],
			projects: [],
			pageIndex: 0,
		}
	},
	methods: {
		/* 
			name: 项目设置
			desc: 根据项目id进入项目编辑界面
		*/
		projectSetting(project)
		{
			uni.navigateTo({
				url: `Project?id=${project.id}`
			})
		}
	},
  created() {
    getProjects()
    .then(res => {
			this.projects = res.data.filter(item => item.creatorPhone === getApp().globalData.gUserInfo.phone)
    })
  }
}
</script>

<style lang="stylus">
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
		/* 卡片 */
</style>
