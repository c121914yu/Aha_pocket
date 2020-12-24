<template>
	<view class="resource-home">
		<!-- 轮播图 -->
		<view class="header">
			<SlideCard :images="images"></SlideCard>
		</view>
		<!-- 榜单 -->
		<view class="ranking">
			<!-- 类型 -->
			<view class="kind">
				<view class="week" :class="rankType === 'week' ? 'active' : ''" @click="rankType = 'week'">
					<text class="iconfont icon-bangdan"></text>
					<text>每周榜单</text>
				</view>
				<view class="news" :class="rankType === 'news' ? 'active' : ''" @click="rankType = 'news'">
					<text class="iconfont icon-tubiaozuixin01"></text>
					<text>最新推荐</text>
				</view>
			</view>
			<!-- 列表 -->
			<view class="list">
				<projectCard
					v-for="(project, index) in RankingData"
					:key="index"
					:ranking="index + 1"
					:border="index === 2 ? false : true"
					:project="project"
					@click="readProject(project.id)"
				></projectCard>
			</view>
		</view>
		<!-- 比赛推荐 -->
		<view class="recommand">
			<view class="title">
				<text 
					:class="index === sortIndex ? 'active' : ''" 
					v-for="(sort, index) in sortList" 
					:key="sort" 
					@click="sortIndex=index;loadProjects(true)">
					{{ sort.text }}
				</text>
				<text 
					:style="{
						color: filterActive ? 'var(--origin2)' : ''
					}"
					class="filter" 
					@click="is_showFileter = true">
					筛选
					<text class="iconfont icon-shaixuan"></text>
				</text>
			</view>
			<!-- 推荐比赛列表 -->
			<view class="list">
				<projectCard
					v-for="(project, index) in commands"
					:key="index"
					margin="0 0 5px 0"
					:radius="index === 0 ? '0 0 16px 16px' : '16px'"
					:project="project"
					@click="readProject(project.id)"
				></projectCard>
			</view>
		</view>
		<view class="center small remark">{{ is_showAll ? "已加载全部" : "" }}</view>

		<!-- 筛选组件 -->
		<ProjectFilter v-if="is_showFileter" @sureFilter="sureFilter" @close="is_showFileter=false"></ProjectFilter>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getProjects } from '@/static/request/api_project.js';
export default {
	data() {
		return {
			images: [
				{url: 'https://aha-public.oss-cn-hangzhou.aliyuncs.com/resource/53/wxafd522b076e38be0.o6zAJsx62hZlfFMtuuRW5YzShUps.l5VxpCL0psJU6a072385c43fa7d08b8ec38bf1b760ff.png',name: "反向寻车系统",to: '' },
				{url: 'http://blogs.jinlongyuchitang.cn/background.jpg',name: "反向寻车系统", to: '' },
				{url: 'http://blogs.jinlongyuchitang.cn/background.jpg',name: "反向寻车系统", to: '' },
				{url: 'https://aha-public.oss-cn-hangzhou.aliyuncs.com/resource/55/wxafd522b076e38be0.o6zAJsx62hZlfFMtuuRW5YzShUps.XONdUyq1A2d5d0fdaf1a2189515e12e9ce2779f01da7.JPG',name: "反向寻车系统",to: ''}
			],
			rankType: 'week',
			sortList: [
				{ text: '综合', val: 'read' }, 
				{ text: '收藏量', val: 'collect' }, 
				{ text: '最新', val: 'time' }, 
				{ text: '获奖等级', val: 'awardLevel' },
			],
			pageNum: 1,
			pageSize: 5,
			sortIndex: 0,
			compId: null,
			awardLevel: null,
			filterActive: false,
			RankingData: [],
			commands: [],
			is_showFileter: false,
			is_showAll: false
		};
	},
	methods: {
		/* 
			name: 获取项目
			desc: 请求项目数据，根据界面条件排序/筛选。传入init参数，判断是否初始化进行操作。
			time: 2020/12/4
		*/
		loadProjects(init=false,loading=true) 
		{
			if (init) {
				this.is_showAll = false
				this.pageNum = 1
			}
			this.gLoading(this, loading)
			let params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortList[this.sortIndex].val
			}
			if(this.compId !== null){
				params.compId = this.compId
			}
			if(this.awardLevel!== null){
				params.awardLevel = this.awardLevel
			}
			getProjects(params)
			.then(res => {
				if(res.data.pageData.length < this.pageSize){
					this.is_showAll = true
				}
				else{
					this.pageNum++
				}
				this.commands = init ? res.data.pageData : this.commands.concat(res.data.pageData)
				
				/* 获取推荐 */
				if(this.commands.length >= 3){
					this.RankingData = [this.commands[0], this.commands[1], this.commands[2]]
				}
				else if(this.commands.length > 0){
					this.RankingData = [].concat(this.commands)
				}
				else{
					this.showStatus = 3
				}
				
				this.gLoading(this, false)
				uni.stopPullDownRefresh()
				console.log(this.commands);
			})
			.catch(err => {
				this.gLoading(this, false)
				uni.stopPullDownRefresh()
			})
		},
		/* 
			name: 加载更多数据
			time: 2020/11/30
		*/
		loadMore() 
		{
			if (!this.is_showAll) {
				this.loadProjects(false,false)
			}
		},
		/* 
			name: 确认筛选
			desc: 获取筛选模式，关闭弹窗，请求数据
		*/
	    sureFilter(e)
	    {
		    if(e.type === "all"){
				this.filterActive = false
			}
			else{
				this.filterActive = true
			}
			this.compId = null
			this.awardLevel = null
		   
			this[e.type] = e.value
			this.loadProjects(true)
			this.is_showFileter = false
	    },
		/* 进入项目详细 */
		readProject(id) 
		{
			uni.navigateTo({
				url: `Project/Project?id=${id}`
			})
		}
	},
	created() {
		this.loadProjects(true)
	}
}
</script>

<style lang="stylus">
.resource-home
	// 偏离底部导航距离
	padding-bottom 140rpx
	background-color var(--white1)
	// 轮播图
	.header
		height 47vw
		background-color var(--origin3)
		border-bottom-left-radius 12px
		border-bottom-right-radius 12px
	/* 榜单 */
	.ranking
		margin 50px auto 0
		width 90%
		.kind
			display flex
			border-radius 22px
			overflow hidden
			background-color var(--origin3)
			view
				flex 1
				padding 10px 0 50px
				color var(--origin2)
				font-weight 600
				font-size 28rpx
				display flex
				align-items center
				justify-content center
				.iconfont
					margin-right 5px
					font-size 32rpx
				&.active
					background-color var(--origin2)
					color #FFFFFF
					border-radius 22px
		.list
			transform translateY(-40px)
			border-radius 22px
			overflow hidden
	/* 推荐列表 */
	.recommand
		transform translateY(-15px)
		margin 0 auto
		width 90%
		// 开头标题
		.title
			background-color var(--white2)
			border-top-left-radius 22px
			border-top-right-radius 22px
			font-size 24rpx
			display flex
			align-items center
			justify-content space-around
			text
				padding 20rpx 0
			.active
				color var(--origin2)
				font-weight 700
			.filter
				display flex
				align-items center
				.iconfont
					font-size 30rpx
	.remark
		transform translateY(-15px)
		color var(--gray2)
</style>
