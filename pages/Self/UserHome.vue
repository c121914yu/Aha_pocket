<!-- 
	用户信息主页
	author yjl
-->
<template>
	<view class="user-home">
		<view class="header">
			<view class="first">
				<view class="left">
					<Avatar :src="avatarUrl"></Avatar>
					<UserLevel :point="userPoint"></UserLevel>
				</view>
			  	<view class="right">
			  		<view class="nickname">{{nickname}}</view>
			  		<view class="honor"></view>
			  		<Tags :tags="arr_tags"></Tags>
					<!-- 用户关系，非自己可以点击关注，咨询 -->
					<view v-if="userRelation !== 1" class="user-relation">
						<view class="attention" @click="onclickAttention">
							<text class="iconfont icon-xiazai"></text>
							{{userRelation === 2 ? "取消关注" : "关注"}}
						</view>
						<navigator class="consult" :url="`./Inform/Inform_send?id=${userId}`">
							<text class="iconfont icon-xiazai"></text>咨询
						</navigator>
					</view>
					<button class="share" open-type="share">
						<text class="iconfont icon-xiazai"></text>分享
					</button>
			  	</view>
			</view>
			<view class="second">
				<view class="statistics center">
					<view class="strong">{{Math.floor(userPoint)}}Aha币</view>
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
			:navs="arr_navs"
			color="var(--black)"
			backgroundColor="#ffffff"
			@navChange="trackType=$event.val">
		</TopNavs>
		<!-- 足迹内容 -->
		<view class="card tracks">
			<TimeTracks :tracks="arr_userTracks"></TimeTracks>
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
import { getUser,getUserStatistice,getUserTracks,getResume,followUser,unfollowUser,getUserRelation } from '@/static/request/api_userInfo.js'
export default {
	data() {
		return {
			userId: '',
			userRelation: 1,//0-无关系 1-自己 2-已关注 3-被关注 4-互关
			avatarUrl: '',
			nickname: 'Aha会员',
			arr_tags: [],
			userPoint: 0, //用户累计Aha点
			resume: null,
			arr_navs: [
				{label: "平台轨迹",val: ""},
				{label: "竞赛",val: "project"},
				{label: "服务",val: ""},
				{label: "外包",val: ""}
			],
			trackType: "",
			arr_userTracks: []
		}
	},
	onLoad(e) {
		if (!e.userId) {
			this.gBackPage("ID无效")
		}
		else {
			this.gLoading(this, true)
			this.userId = e.userId
			/* 根据用户userId，请求数据 */
			getUser(this.userId)
			.then(res => {
				/* 格式化比赛标签和特征标签 */
				if(res.data.specialtyTags){
					this.arr_tags = this.arr_tags.concat(res.data.specialtyTags.split(','))
				}
				if(res.data.compTags){
					this.arr_tags = this.arr_tags.concat(res.data.compTags.split(','))
				}
				this.avatarUrl = res.data.avatarUrl
				this.nickname = res.data.nickname
			})
			/* 获取用户关系,用户等级,介绍，用户轨迹 */
			Promise.all([getUserRelation(this.userId),getUserStatistice(this.userId),getResume(this.userId),this.getUserTrack()])
			.then(res => {
				this.userRelation = res[0].data
				this.userPoint = res[1].data.totalContribPoint
				this.resume = res[2].data
				// console.log(this.resume)
			})
			this.gLoading(this, false)
		}
	},
	methods: {
		/**
		 * 点击 关注/取消关注，执行不同方法
		 */
		onclickAttention()
		{
			/* userRelation=2代表已关注 */
			if(this.userRelation === 2){
				unfollowUser(this.userId)
				this.userRelation = 0
			}
			else{
				followUser(this.userId)
				this.userRelation = 2
			}
			/* 震动 */
			uni.vibrateLong()
		},
		/**
		 * 获取用户轨迹信息
		 */
		getUserTrack()
		{
			return  getUserTracks(this.userId,this.trackType)
					.then(res => {
						res.data.forEach(track => {
							const date = new Date(track.date)
							track.date = `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`
							this.arr_userTracks.push(track)
						})
						console.log(res.data)
					})
		}
	}
}
</script>

<style lang="stylus" scoped>
.user-home
	min-height 100vh
	padding-bottom 10px
	background-color var(--white1)
	.header
		background-color var(--origin4)
		/* 头像 标签 昵称等 */
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
					margin 15px 0 5px 0
					padding 0 10px
					border-radius 22px
					font-size 20rpx
					color #FFFFFF
					background-color var(--nav-color)
					display inline-block
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
		/* 统计数据 */
		.second
			padding 10px 0
			color var(--gray1)
			display flex
			justify-content space-around
	/* 用户信息卡片 */
	.card
		margin 15px auto
		width 95%
		padding 10px
		border-radius 22px
		background-color #FFFFFF
		.h3
			color #333333
		.reamrk
			text-align center
			font-size 22rpx
			color var(--gray2)
	/* 简历 */
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
