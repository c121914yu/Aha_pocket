<!-- 用户信息主页 -->
<template>
	<view class="user-home">
		<view class="blank"></view>
		<view class="container">
			<view class="head">
				<view class="left">
					<image class="avatar" :src="avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></image>
					<view class="user-level">
						<image 
							:src="'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/userLevel/'+userLevel.src" 
							mode="widthFix">
						</image>
						<text>{{userLevel.label}}</text>
					</view>
				</view>
				<view class="right">
					<view class="name">
						<text class="h3">{{nickname}}</text>
						<!-- 私信按键 -->
						<navigator :url="'Inform/Inform_send?id=' + userId">
							<text class="iconfont icon-sixin"></text>
						</navigator>
					</view>
					<!-- 标签 -->
					<view class="tags">
						<view 
							class="tag"
							v-for="tag in tags"
							:key="tag">
							{{tag}}
						</view>
					</view>
					<!-- 个人介绍 -->
					<view class="intro">
						<view class="title">个人介绍</view>
						<view class="content">{{intro ? intro : "这个人还没填写简历" }}</view>
					</view>
				</view>
			</view>
			<view style="transform: translateY(-10vw);">
				<view class="activity">
					<view class="title" @click="showProject=!showProject">
						<text class="name">历史参与项目</text>
						<view class="amount">{{statistice.totalProject}}</view>
						<text 
							:style="{
								transform: `rotate(${showProject ? 0 : 180}deg)`
							}"
							class="iconfont icon-xiala">
						</text>
					</view>
					<view 
						:style="{
							height: `${showProject ? projects.length*35 : 0}px`
						}"
						class="list">
						<navigator 
							class="item"
							v-for="(item,index) in projects"
							:key="index"
							:url="'../Project/Project?id=' + item.id">
							<text class="name">{{item.name}}</text>
							<text class="iconfont icon-arrow-right"></text>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getUser,getUserStatistice } from '@/static/request/api_userInfo.js';
import { getProjects } from '@/static/request/api_project.js';
export default {
	data() {
		return {
			userId: '',
			avatarUrl: '',
			userLevel: getApp().globalData.arr_userLevel[0],
			nickname: '',
			tags: [],
			intro: '',
			statistice: {
				totalProject: 0,
				totalReceivedCollection: 0
			},
			
			/* 项目 */
			showProject: false,
			projects: [],
			/* 外包 */
			showEpibolies: false,
			epibolies: [{ name: '***小程序', id: 0 }, { name: '***网页', id: 0 }, { name: '***算法', id: 0 }]
		};
	},
	onLoad(e) {
		if (!e.userId) {
			this.gToastError('ID为空')
			uni.navigateBack({
				delta: 1
			})
		} 
		else {
			this.gLoading(this, true);
			this.userId = e.userId;
			/* 获取用户userId，请求数据 */
			getUser(this.userId)
			.then(res => {
				/* 格式化比赛标签和特征标签 */
				if(res.data.specialtyTags){
					this.tags = this.tags.concat(res.data.specialtyTags.split(','))
				}
				if(res.data.compTags){
					this.tags = this.tags.concat(res.data.compTags.split(','))
				}
				this.avatarUrl = res.data.avatarUrl
				this.nickname = res.data.nickname
				this.intro = res.data.intro
			})
			/* 获取用户等级 */
			getUserStatistice(this.userId)
			.then(res => {
				this.userLevel =  getApp().globalData.arr_userLevel.find(item => res.data.totalContribPoint < item.totalContribPoint)
				this.statistice.totalProject = res.data.totalProject
			})
			/* 获取5条收藏量最多的项目项目 */
			getProjects({
				userId: this.userId,
				pageNum: 1,
				pageSize: 10,
				sortBy: 'collect'
			})
			.then(res => {
				this.projects = res.data.pageData
				this.showProject = true
				this.gLoading(this, false)
			})
			.catch(err => {
				this.gLoading(this, false)
			})
		}
	},
	methods: {
		
	}
};
</script>

<style lang="stylus" scoped>
.user-home
	min-height 100vh
	background-color var(--origin3)
	.blank
		width 100%
		height 10vh
	.container
		width 100%
		min-height 90vh
		background-color var(--origin4)
		border-radius 22px 22px 0 0
		padding 0 5%
		.head
			transform translateY(-13vw)
			display flex
			align-items center
			.left
				display flex
				flex-direction column
				align-items center
				.avatar
					width 30vw
					height 30vw
					border-radius 50%
					border 8px solid #FFFFFF
				.user-level
					position relative
					margin-top 10px
					padding 2px 20px 2px 40px
					color var(--origin1)
					background-color #FFFFFF
					font-size 24rpx
					font-weight 700
					border-radius 22px
					display flex
					align-items center
					image
						position absolute
						left 0
						top 0
						width 25px
			.right
				margin-left 10px
				flex 1
				.name
					color #FFFFFF
					letter-spacing 1px
					display flex
					justify-content space-between
					.iconfont
						color var(--origin1)
				.tags
					min-height 30px
					display flex
					flex-wrap wrap
					.tag
						margin 0 5px 5px 0
						padding 0 10px
						color #FFFFFF
						background-color var(--origin1)
						border-radius 30px
						font-size 18rpx
				.intro
					height 70px
					padding 2px 5px
					border-radius 8px
					background-color #FFFFFF
					line-height 1.4
					overflow hidden
					.title
						color var(--origin2)
						font-size 22rpx
						font-weight 700
					.content
						font-size 20rpx
						color var(--gray2)
		.activity
			margin 10px 0
			border-radius 16px
			overflow hidden
			.title
				padding 5px 10px
				background-color var(--origin3)
				display flex
				align-items center
				.name
					flex 1
					font-size 26rpx
					color #FFFFFF
					font-weight 700
					
				.amount
					margin-right 5px
					width 20px
					height 20px
					text-align center
					line-height 20px
					font-size 24rpx
					color var(--origin2)
					background-color #FFFFFF
					border-radius 50%
				.iconfont
					color var(--origin1)
					transition var(--speed-hover)
			.list 
				overflow hidden
				transition var(--speed-hover)
				.item
					background-color #FFFFFF
					height 35px
					padding-left 20px
					padding-right 10px
					border-bottom var(--border2)
					display flex
					align-items center
					.name
						flex 1
						font-size 24rpx
					.iconfont
						color var(--origin2)
</style>
