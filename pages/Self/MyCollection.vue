<!-- 我的收藏 -->
<template>
	<view class="my-collection">
		<!-- 导航 -->
		<TopNavs
			:navs="navs"
			padding
			@navChange="changeType">
		</TopNavs>
		<!-- <view class="navs">
			<view 
				class="nav"
				:class="index === activeNav ? 'active' : ''"
				v-for="(nav,index) in navs"
				:key="index"
				@click="changeType(nav,index)">
				<view>{{nav.name}}</view>
				<view class="amount">{{nav.amount}}</view>
			</view>
		</view> -->
		<!-- 列表 -->
		<view class="list" v-if="activeNav === 0">
			<navigator 
				class="item"
				hover-class="none"
				v-for="(project, index) in list"
				:key="index"
				:url="'/pages/Project/Project?id='+project.id">
				<projectCard
					margin="5px 0"
					radius="16px"
					:project="project"
				></projectCard>
			</navigator>
		</view>
		<view class="remark small center">已加载全部</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getCollectedProjects } from "@/static/request/api_userInfo.js"
import ProjectCard from "../Project/components/ProjectCard.vue"
export default {
	data() {
		return {
			navs: [
				{label: "项目",value: "project",amount: 0},
				{label: "组队",value: "teams",amount: 0},
				// {label: "外包",val: "project",amount: 0},
			],
			activeNav: 0,
			list: [],
		}
	},
	components: {
		ProjectCard
	},
	onLoad() {
		this.getProjects()
	},
	methods: {
		/* 改变展示收藏的类型，修改下标，重新请求数据 */
		changeType(nav,index)
		{
			if(this.activeNav === index){
				return
			}
			this.activeNav = index
			switch(index){
				case 0: this.getProjects();break;
				case 1: this.getProjects();break;
				case 2: this.getProjects();break;
			}
		},
		/* 获取个人收藏项目 */
		getProjects()
		{
			this.gLoading(this,true)
			getCollectedProjects()
			.then(res => {
				this.list = res.data.map(item => {
					return {
						...item.project
					}
				})
				this.navs[0].amount = this.list.length
				console.log(this.list)
				this.gLoading(this,false)
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		},
		/* 查看收藏内容 */
		readed(url)
		{
			
		}
	}
}
</script>

<style lang="stylus" scoped>
.my-collection
	min-height 100vh
	background-color var(--white1)
	.navs
		margin-bottom 10px
		border-bottom-left-radius 22px
		border-bottom-right-radius 22px
		display grid
		grid-template-columns repeat(3,1fr)
		overflow hidden
		.nav
			background-color #FFFFFF
			padding 10px
			font-size 26rpx
			display flex
			align-items center
			justify-content center
			.amount
				margin-left 5px
				width 14px
				height 14px
				text-align center
				line-height 14px
				border-radius 50%
				background-color var(--origin2)
				color #FFFFFF
				font-size 22rpx
				font-weight 700
			&.active
				background-color var(--origin2)
				color #FFFFFF
				.amount
					background-color #FFFFFF
					color var(--origin2)
	.list
		margin 0 5%
		.item
			width 100%
	.remark
		margin-top 10px
		color var(--gray2)
</style>
