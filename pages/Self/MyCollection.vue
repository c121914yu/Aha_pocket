<!-- 我的收藏 -->
<template>
	<view class="my-collection">
		<!-- 导航 -->
		<view class="navs">
			<view 
				class="nav"
				:class="index === activeNav ? 'active' : ''"
				v-for="(nav,index) in navs"
				:key="index"
				@click="changeType(nav,index)">
				<view>{{nav.name}}</view>
				<view class="amount">{{nav.amount}}</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="list" v-if="activeNav === 0">
			<navigator 
				class="item"
				hover-class="none"
				v-for="(project, index) in list"
				:key="index"
				:url="'/pages/Project/Project?id='+project.id">
				<projectCard
					margin="10px 0"
					radius="16px"
					:project="project"
				></projectCard>
			</navigator>
		</view>
		
		<!-- 提示文字 -->
		<view class="remark center small">无更多数据</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getCollectedProjects } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			navs: [
				{name: "项目",val: "project",amount: 10},
				{name: "组队",val: "project",amount: 6},
				{name: "外包",val: "project",amount: 6},
			],
			activeNav: 0,
			list: []
		}
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
	},
	onLoad() {
		this.getProjects()
	}
}
</script>

<style lang="stylus" scoped>
.my-collection
	min-height 100vh
	background-color var(--origin4)
	padding 10px
	.navs
		display flex
		justify-content space-around
		.nav
			background-color var(--white2)
			padding 5px 10px
			border-radius 8px
			border 1px solid var(--origin1)
			display flex
			align-items center
			.amount
				margin-left 10px
				width 25px
				height 25px
				text-align center
				line-height 25px
				border-radius 50%
				background-color var(--origin2)
				color #FFFFFF
				font-size 26rpx
				font-weight 700
		.active
			background-color var(--origin2)
			color #FFFFFF
			.amount
				background-color #FFFFFF
				color var(--black)
	.list
		.item
			width 100%
	.remark
		margin-top 10px
</style>
