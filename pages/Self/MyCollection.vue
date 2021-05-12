<!-- 
	我的收藏
	author yjl
-->
<template>
	<view class="my-collection">
		<!-- 导航 -->
		<top-navs
			:navs="arr_navs"
			padding
			@navChange="changeType">
		</top-navs>
		<!-- 列表 -->
		<view class="list" v-if="activeNav === 0">
			<navigator 
				class="item"
				hover-class="none"
				v-for="(project, index) in arr_list"
				:key="index"
				:url="`/pages/Project/Project?id=${project.id}`">
				<project-card
					margin="5px 0"
					radius="16px"
					:project="project"
				>
				</project-card>
			</navigator>
		</view>
		<view class="remark small center">已加载全部</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getCollectedProjects } from "@/static/request/api_userInfo.js"
import ProjectCard from "../Project/components/ProjectCard.vue"
export default {
	components: {
		"project-card": ProjectCard
	},
	data() {
		return {
			arr_navs: [
				{label: "项目",value: "project",amount: 0},
				{label: "组队",value: "teams",amount: 0},
				// {label: "外包",val: "project",amount: 0},
			],
			activeNav: 0,
			arr_list: [],
		}
	},
	onLoad() {
		this.getProjects()
	},
	methods: {
		/**
		 * 改变展示收藏的类型，修改下标,重新请求数据
		 * @param {Object} nav
		 * @param {Object} index
		 */
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
		/**
		 * 获取个人收藏项目
		 */
		getProjects()
		{
			this.gLoading(this,true)
			getCollectedProjects()
			.then(res => {
				this.arr_list = res.data.map(item => ({
					...item.project
				}))
				this.arr_navs[0].amount = this.arr_list.length
				console.log(this.arr_list)
			})
			.finally(err => this.gLoading(this,false))
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
	.list
		margin 0 5%
		.item
			width 100%
	.remark
		margin-top 10px
		color var(--gray2)
</style>
