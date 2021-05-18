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
			radius="0"
			@navChange="changeType">
		</top-navs>
		<!-- 列表 -->
		<view class="projects" v-if="activeNav === 0">
			<navigator 
				v-for="(project, index) in arr_list"
				:key="project.id"
				hover-class="none"
				:url="`../Project/Project?id=${project.id}`">
				<project-card
					margin="10px 0"
					radius="16px"
					:project="project">
				</project-card>
			</navigator>
		</view>
		<view class="forums" v-if="activeNav === 1">
			<navigator
				class="forum"
				v-for="(item,index) in arr_list"
				:key="item.id"
				:url="`/pages/Interflow/Forum/ForumDetail?id=${item.id}`">
				<forum-card :forum="item"></forum-card>
			</navigator>
		</view>
		
		<view class="remark center">{{is_loadAll ? "已加载全部" : ""}}</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getCollectedProjects } from "@/static/request/api_userInfo.js"
import { getMylikeDiscussion } from "@/static/request/api_forum.js"
import ProjectCard from "../Project/components/ProjectCard.vue"
import ForumCard from "../Interflow/Forum/components/ForumCard.vue"
export default {
	components: {
		"project-card": ProjectCard,
		"forum-card": ForumCard
	},
	data() {
		return {
			arr_navs: [
				{label: "项目",value: "project",amount: 0},
				{label: "讨论",value: "forum",amount: 0},
				// {label: "外包",val: "project",amount: 0},
			],
			activeNav: 0,
			pageNum: 0,
			pageSize: 10,
			is_loadAll: false,
			arr_list: [],
		}
	},
	onLoad() {
		this.loadProject(true,true)
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
			this.is_loadAll = false
			this.pageNum = 0
			switch(index){
				case 0: this.loadProject(true,true);break;
				case 1: this.loadForum(true,true);break;
				case 2: this.loadProject();break;
			}
		},
		/**
		 * 加载个人收藏项目
		 */
		loadProject(init=false,loading=false)
		{
			this.gLoading(this,loading)
			getCollectedProjects()
			.then(res => {
				this.arr_list = res.data.map(item => ({
					...item.project
				}))
				this.arr_navs[0].amount = this.arr_list.length
				this.is_loadAll = true
				console.log(this.arr_list)
			})
			.finally(err => this.gLoading(this,false))
		},
		/**
		 * 获取个人收藏讨论
		 */
		loadForum(init=false,loading=false)
		{
			this.gLoading(this,loading)
			getMylikeDiscussion({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				isLike: true
			})
			.then(res => {
				if(init) {
					this.arr_list = []
				}
				this.arr_list = this.arr_list.concat(res.data.pageData)
				if(res.data.pageData.length < this.pageSize) {
					this.is_loadAll = true
				}
				else {
					this.pageNum++
				}
				console.log(this.arr_list);
			})
			.finally(err => this.gLoading(this,false))
		}
	}
}
</script>

<style lang="stylus" scoped>
.my-collection
	min-height 100vh
	padding-bottom 10px
	background-color var(--white1)
	navigator
		display block
	.projects
		padding 0 5%
	.forums
		border-top var(--border2)
		background-color #FFFFFF
		.forum
			border-bottom var(--border2)
	.remark
		margin 10px 0
		color var(--gray2)
</style>
