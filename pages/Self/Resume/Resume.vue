<template>
	<view class="resume">
		<!-- 头部 -->
		<navigator 
			class="header"
			hover-class="none"
			url="components/BaseInfo">
			<image class="avatar" :src="avatarUrl"></image>
			<view class="right">
				<view class="name">
					{{resume.name || "姓名"}}
					<image v-if="resume.gender === '男'" class="gender"  src="@/static/icon/male.png"></image>
					<image v-else-if="resume.gender === '女'" class="gender"  src="@/static/icon/female.png"></image>
				</view>
				<view class="edit">
					<text class="iconfont icon-write"></text>
					<text>编辑基本信息</text>
				</view>
			</view>
		</navigator>
		<!-- 教育经历 -->
		<view class="resume-item edu">
			<navigator class="head" hover-class="none" url="components/EduExperience">
				<view class="h3">教育经历</view>
				<text class="desc"></text>
				<text class="iconfont icon-add-fill"></text>
			</navigator>
			<view class="list">
				<navigator 
					class="item"
					hover-class="none"
					v-for="(item,index) in resume.eduExperiences"
					:key="index"
					:url="'components/EduExperience?index=' + index">
					<view class="head">{{item.school}}</view>
					<view class="small degree">
						{{item.degree}}
						<text v-if="item.specialty">/{{item.specialty}}</text>
						<text v-if="item.grade">(排名: {{item.grade}})</text>
					</view>
					<view class="small time">
						<text v-if="item.startTime">{{item.startTime}}-</text>
						{{item.endTime}}
					</view>
					<text class="iconfont icon-right"></text>
				</navigator>
			</view>
		</view>
		<!-- 校园经历 -->
		<view class="resume-item school">
			<navigator class="head" hover-class="none" url="components/SchoolExperience">
				<view class="h3">校园经历</view>
				<text class="desc"></text>
				<text class="iconfont icon-add-fill"></text>
			</navigator>
			<view class="list">
				<navigator 
					class="item"
					hover-class="none"
					v-for="(item,index) in resume.schoolExperiences"
					:key="index"
					:url="'components/SchoolExperience?index=' + index">
					<view class="head">{{item.organization}}</view>
					<view class="small">{{item.post}}</view>
					<view class="small">
						<text v-if="item.startTime">{{item.startTime}}-</text>
						{{item.endTime}}
					</view>
					<text class="iconfont icon-right"></text>
				</navigator>
			</view>
		</view>
		<!-- 项目经历 -->
		<view class="resume-item project">
			<navigator class="head" hover-class="none" url="components/ProjectExperience">
				<view class="h3">项目经历</view>
				<text class="desc"></text>
				<text class="iconfont icon-add-fill"></text>
			</navigator>
			<view class="list">
				<navigator
					class="item"
					hover-class="none"
					v-for="(item,index) in resume.projectExperiences"
					:key="index"
					:url="'components/ProjectExperience?index=' + index">
					<view class="head">{{item.name}}</view>
					<view class="small">{{item.content}}</view>
					<view class="small">
						<text v-if="item.startTime">{{item.startTime}}-</text>
						{{item.endTime}}
					</view>
					<text class="iconfont icon-right"></text>
				</navigator>
			</view>
		</view>
		<!-- 实习经历 -->
		<view class="resume-item protect">
			<navigator class="head" hover-class="none" url="components/PracticeExperience">
				<view class="h3">实习经历</view>
				<text class="desc"></text>
				<text class="iconfont icon-add-fill"></text>
			</navigator>
			<view class="list">
				<navigator
					class="item"
					hover-class="none"
					v-for="(item,index) in resume.practiceExperiences"
					:key="index"
					:url="'components/PracticeExperience?index=' + index">
					<view class="head">{{item.company}}</view>
					<view class="small">{{item.post}}</view>
					<view class="small">
						<text v-if="item.startTime">{{item.startTime}}-</text>
						{{item.endTime}}
					</view>
					<text class="iconfont icon-right"></text>
				</navigator>
			</view>
		</view>
		<!-- 个人技能描述 -->
		<navigator class="resume-item skill" hover-class="none" url="components/Skill">
			<view class="head">
				<view class="h3">个人技能描述</view>
				<text class="desc"></text>
				<text style="color: var(--gray1);font-weight:700;" class="iconfont icon-right"></text>
			</view>
			<view class="message">
				{{resume.projectSkill || ""}}
			</view>
		</navigator>
		<!-- 个人荣誉 -->
		<view class="resume-item honors">
			<navigator class="head" hover-class="none" url="components/Honors">
				<view class="h3">个人荣誉</view>
				<text class="desc"></text>
				<text class="iconfont icon-add-fill"></text>
			</navigator>
			<view class="list">
				<navigator 
					class="item"
					hover-class="none"
					v-for="(item,index) in resume.honors"
					:key="index"
					:url="'components/Honors?index='+index">
					<view class="head">{{item.name}}</view>
					<view class="small">{{item.time}}</view>
					<text class="iconfont icon-right"></text>
				</navigator>
			</view>
		</view>
		<!-- 自我描述 -->
		<navigator class="resume-item description" hover-class="none" url="components/SelfIntro">
			<view class="head">
				<view class="h3">自我描述</view>
				<text class="desc"></text>
				<text style="color: var(--gray1);font-weight:700;" class="iconfont icon-right"></text>
			</view>
			<view class="message">
				{{resume.intro || ""}}
			</view>
		</navigator>
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getResume, putResume } from '@/static/request/api_userInfo.js'
export default {
	data() {
		return {
			resume: null,
			avatarUrl: getApp().globalData.gUserInfo.userInfo.avatarUrl
		}
	},
	onShow() {
		this.gLoading(this, true);
		/* 已经有简历记录 */
		if(getApp().globalData.gResume){
			this.resume = getApp().globalData.gResume
			this.$forceUpdate()
			this.updateProgress()
		}
		else {
			getResume(getApp().globalData.gUserInfo.userInfo.userId)
			.then(res => {
				this.resume = res.data
				getApp().globalData.gResume = res.data
				this.updateProgress()
			})
			.catch(err => {
				this.gLoading(this, false)
			})
		}
	},
	methods: {
		/* 更新导航栏标题 */
		updateProgress()
		{
			let length = -1
			let noBlank = 0
			/* 统计完整度 */
			for(let key in this.resume){
				length++
				if(this.resume[key] && this.resume[key].length > 0){
					noBlank++
				}
			}
			/* 更新导航文字 */
			uni.setNavigationBarTitle({
				title: `个人简历(${Math.round(noBlank/length*100)}%)`
			})
			console.log(this.resume);
			this.gLoading(this, false)
		}
	}
}
</script>

<style lang="stylus">
.resume
	padding 20px 5% 60px 5%
	.header
		margin-bottom 20px
		display flex
		.avatar
			position relative
			width 60px
			height 60px
			border-radius 50%
		.right
			padding-left 20px
			display flex
			flex-direction column
			justify-content space-around
			.name
				font-size 40rpx
				font-weight 700
				display flex
				align-items center
				.gender
					margin-left 10px
					width 18px
					height 18px
			.edit
				color var(--gray1)
				font-size 24rpx
				.iconfont
					margin-right 10px
	.resume-item
		padding 15px 0
		border-bottom var(--border2)
		display block
		.head
			display flex
			align-items center
			.h3
				flex 1
				font-size 32rpx
			.desc
				margin 0 10px
				color var(--gray2)
				font-size 24rpx
			.iconfont
				color var(--origin2)
		.list
			.item
				position relative
				margin 15px 0
				display block
				.head
					font-size 28rpx
				.small
					color var(--gray2)
				.icon-right
					position absolute
					right 0
					top 50%
					transform translateY(-50%)
					color var(--gray1)
					font-weight 700
		.message
			font-size 24rpx
			color var(--gray2)
			white-space pre-wrap
</style>