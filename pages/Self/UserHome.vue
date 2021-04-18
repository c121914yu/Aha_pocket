<!-- 用户信息主页 -->
<template>
	<view class="user-home">
		<view class="header">
			<view class="first">
				<view class="left">
					<Avatar :src="avatarUrl"></Avatar>
					<UserLevel v-if="userPoint !== null" :point="userPoint"></UserLevel>
				</view>
			  	<view class="right">
			  		<view class="nickname">{{nickname}}</view>
			  		<view class="honor">全国大学生服务外包大赛: 国一</view>
			  		<view class="tags">
			  			<view 
			  				class="tag"
			  				v-for="(tag,index) in tags"
			  				:key="index">
			  				{{tag}}
			  			</view>
			  		</view>
					<view v-if="userRelation !== 1" class="user-relation">
						<view class="attention" @click="attentionUser">
							<text class="iconfont icon-xiazai"></text>
							{{userRelation === 2 ? "取消关注" : "关注"}}
						</view>
						<navigator class="consult" :url="'./Inform/Inform_send?id=' + userId">
							<text class="iconfont icon-xiazai"></text>咨询
						</navigator>
						<button class="share" open-type="share">
							<text class="iconfont icon-xiazai"></text>分享
						</button>
					</view>
			  	</view>
			</view>
			<view class="second">
				<view class="statistics center">
					<view class="strong">{{userPoint | filter_point}}Aha币</view>
					<view class="small">竞赛成果</view>
				</view>
				<view class="statistics center">
					<view class="strong">0Aha币</view>
					<view class="small">服务成果</view>
				</view>
				<view class="statistics center">
					<view class="strong">0Aha币</view>
					<view class="small">外包成果</view>
				</view>
			</view>
		</view>
		<!-- 导航 -->
		<TopNavs 
			:navs="navs"
			color="var(--black)"
			backgroundColor="#ffffff"
			@navChange="currentNav=$event">
		</TopNavs>
		<!-- 足迹内容 -->
		<view class="card tracks">
			<view 
				class="track"
				v-for="(track,index) in userTracks"
				:key="index">
				<!-- 辅助点 -->
				<view class="dot"></view>
				<!-- 时间 -->
				<view class="time">{{track.time}}</view>
				<!-- 项目名 -->
				<view class="track-name">{{track.trackName}}</view>
				<!-- 描述 -->
				<view class="result">{{track.result}}</view>
			</view>
			<view v-if="userTracks.length===0" class="remark">暂无用户轨迹</view>
		</view>
		<!-- 简历 -->
		<view v-if="resume && resume.name" class="card resume">
			<view class="h3">简历</view>
			<view class="base-info">
				<Avatar :src="avatarUrl"></Avatar>
				<view class="right">
					<view class="name">{{resume.name}}</view>
					<view class="intro small">{{resume.intro || ""}}</view>
				</view>
			</view>
			<!-- 校园经历 -->
			<view v-if="resume.schoolExperiences.length > 0" class="experience">
				<view class="h3">校园经历</view>
				<view 
					class="item"
					v-for="(exp,index) in resume.schoolExperiences"
					:key="index">
					{{exp.organization}} {{exp.post}}
				</view>
			</view>
			<!-- 项目经历 -->
			<view v-if="resume.projectExperiences.length > 0" class="experience">
				<view class="h3">项目经历</view>
				<view 
					class="item"
					v-for="(exp,index) in resume.projectExperiences"
					:key="index">
					{{exp.name}} {{exp.content}}
				</view>
			</view>
			<!-- 实习经历 -->
			<view v-if="resume.practiceExperiences.length > 0" class="experience">
				<view class="h3">实习经历</view>
				<view 
					class="item"
					v-for="(exp,index) in resume.practiceExperiences"
					:key="index">
					{{exp.company}} {{exp.post}}
				</view>
			</view>
			<!-- 荣誉 -->
			<view  v-if="resume.honors.length > 0"class="experience">
				<view class="h3">荣誉</view>
				<view 
					class="item"
					v-for="(honor,index) in resume.honors"
					:key="index">
					{{honor.name}} {{honor.description}}
				</view>
			</view>
			<!-- 个人技能 -->
			<view v-if="resume.projectSkill" class="experience">
				<view class="h3">个人技能</view>
				<view class="skill small">{{resume.projectSkill}}</view>
			</view>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getUser,getUserStatistice,getUserTracks,getResume,followUser,unfollowUser,getUserRelation } from '@/static/request/api_userInfo.js';
export default {
	data() {
		return {
			userId: '',
			userRelation: 0,//0-无关系 1-自己 2-已关注 3-被关注 4-互关
			avatarUrl: '',
			nickname: 'Aha会员',
			tags: [],
			userPoint: null, //用户累计Aha点
			resume: null,
			navs: [
				{label: "平台轨迹",val: 0},
				{label: "竞赛",val: 1},
				{label: "服务",val: 2},
				{label: "外包",val: 3}
			],
			currentNav: 0,
			userTracks: [
				{time: "2020/3/2",trackName: "加入Aha口袋",result: "welcome"},
			]
		};
	},
	filters: {
		filter_point(val){
			return Math.floor(val)
		}
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
			/* 根据用户userId，请求数据 */
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
			})
			/* 获取用户关系,用户等级,介绍 */
			Promise.all([getUserRelation(this.userId),getUserStatistice(this.userId),getResume(this.userId)])
			.then(res => {
				this.userRelation = res[0].data
				this.userPoint = res[1].data.totalContribPoint
				this.resume = res[2].data
				console.log(this.resume);
			})
			
			/* 获取 */
			/* 获取用户轨迹 */
			// getUserTracks()
			// .then(res => {
			// 	console.log(res);
			// })
			this.gLoading(this, false);
		}
	},
	methods: {
		/* 关注/取消关注 */
		attentionUser()
		{
			if(this.userRelation === 2){
				unfollowUser(this.userId)
				this.userRelation = 0
			}
			else{
				followUser(this.userId)
				this.userRelation = 2
			}
			uni.vibrateLong()
		}
	}
};
</script>

<style lang="stylus" scoped>
.user-home
	min-height 100vh
	padding-bottom 10px
	background-color var(--white1)
	.header
		background-color var(--origin4)
		.first
			padding 15px 0 10px 10%
			display flex
			align-items flex-start
			.right
				position relative
				padding-right 40px
				margin-left 5%
				flex 1
				.nickname
					color var(--black)
					font-weight 700
					font-size 30rpx
				.honor
					margin-top 15px
					padding 0 10px
					border-radius 22px
					font-size 20rpx
					color #FFFFFF
					background-color var(--nav-color)
					display inline-block
				.tags
					margin-top 5px
					display flex
					flex-wrap wrap
					.tag
						margin 0 5px 5px 0
						color #FFFFFF
						padding 0 10px
						border-radius 22px
						font-size 18rpx
						background-color var(--origin2)
				.attention, .consult, .share
					position absolute
					right 0
					padding 0 5px
					border-top-left-radius 22px
					border-bottom-left-radius 22px
					font-size 24rpx
					background-color var(--nav-color)
					color #FFFFFF
					display flex
					align-items center
					.iconfont
						margin-right 2px
				.attention
					top 0
				.consult
					top 35px
				.share
					top 70px
					line-height 1.5
					border-bottom-right-radius 0
					border-top-right-radius 0
		.second
			padding 10px 0
			color var(--gray1)
			display flex
			justify-content space-around
	.card
		margin 15px auto
		width 90%
		padding 10px
		border-radius 22px
		background-color #FFFFFF
		.h3
			color #333333
		.reamrk
			text-align center
			font-size 22rpx
			color var(--gray2)
	.tracks
		max-height 160px
		overflow-y auto
		padding 26px 15px 0 20px
		// 隐藏滚动条
		&::-webkit-scrollbar
			display: none
		.track
			height 42px
			font-size 22rpx
			display flex
			align-items flex-start
			.time
				margin 0 5px
				font-size 20rpx
				color var(--gray1)
			.dot
				position relative
				width 10px
				height 10px
				border-radius 50%
				background-color var(--origin2)
				filter brightness(110%)
				&::after
					content ''
					position absolute
					left 50%
					top 16px
					transform translateX(-50%)
					border-left 1px dashed var(--gray2)
					height 20px
			.track-name
				flex auto
				color var(--origin2)
				font-weight 700
			.result
				margin-left 5px
				flex 0 0 90px
			// 第一个track的上方加虚线
			&:first-of-type .dot::before
				content ''
				position absolute
				left 50%
				top -25px
				transform translateX(-50%)
				border-left 1px dashed var(--gray2)
				height 20px
	.remark
		text-align center
		color var(--gray2)
	.resume
		min-height 100px
		.base-info
			margin-top 5px
			display flex
			.right
				margin-left 15px
				.name
					font-size 34rpx
					color #333333
					font-weight 800
				.intro
					font-size 22rpx
					color var(--gray1)
					line-height 1.3
					white-space pre-wrap
					display -webkit-box
					-webkit-box-orient vertical
					-webkit-line-clamp 5
					overflow hidden
		.experience
			margin-bottom 5px
			border-bottom 2px solid var(--white1)
			padding-bottom 2px
			.item
				padding-left 5px
				color var(--gray2)
			&:last-of-type
				border none
		.skill
			font-size 22rpx
			color var(--gray1)
			white-space pre-wrap
			padding-left 5px
</style>
