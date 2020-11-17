<template>
	<!-- 个人简历 -->
	<view class="resume" v-if="loaded">
		<!-- 基本信息卡片 -->
		<BaseInfo ref="baseInfo"></BaseInfo>
		<!-- 教育经历 -->
		<EduExperience ref="eduExperience"></EduExperience>
		<!-- 校园经历 -->
		<SchoolExperience ref="schoolExperience"></SchoolExperience>
		<!-- 项目经历 -->
		<ProjectExperience ref="projectExperience"></ProjectExperience>
		<!-- 实习经历 -->
		<PracticeExperience ref="practiceExperience"></PracticeExperience>
		<!-- 专业技能卡片 -->
		<ProSkill ref="projectSkill"></ProSkill>
		<!-- 荣誉情况 -->
		<Honors ref="honors"></Honors>
		<!-- 自我介绍 -->
		<SelfDescription ref="selfDescription"></SelfDescription>
		<!-- 按键 -->
		<view class="btns">
			<button class="preview" @click="preview">预览</button>
			<button class="save" @click="commitResume(true)">保存</button>
		</view>
	</view>
</template>

<script>
import { getResume,putResume } from "@/static/request/api_resume.js"
import BaseInfo from "./ResumeComp/BaseInfo.vue"
import EduExperience from "./ResumeComp/EduExperience.vue"
import SchoolExperience from "./ResumeComp/SchoolExperience.vue"
import ProjectExperience from "./ResumeComp/ProjectExperience.vue"
import PracticeExperience from "./ResumeComp/PracticeExperience.vue"
import ProSkill from "./ResumeComp/ProSkill.vue"
import Honors from "./ResumeComp/Honors.vue"
import SelfDescription from "./ResumeComp/SelfDescription.vue"
var timer
export default {
	data() {
		return {
			loaded: false
		}
	},
	methods: {
		/* 
			name: 提交个人简历
			description: 提交个人简历至服务器
			input: null
			return: null
		*/
		commitResume()
		{
			const data = {
				// 基础信息表
				name: this.$refs.baseInfo.name || "",
				phone: this.$refs.baseInfo.phone || "",
				email: this.$refs.baseInfo.email || "",
				gender: this.$refs.baseInfo.gender || "男",
				birth: this.$refs.baseInfo.birth || "",
				highestDegree: this.$refs.baseInfo.highestDegree || "",
				identity: this.$refs.baseInfo.identity || "学生",
				currentGrade: this.$refs.baseInfo.currentGrade || "",
				workPlace: this.$refs.baseInfo.workPlace || "",
				profession: this.$refs.baseInfo.profession || "",
				// 教育经历
				eduExperiences: this.$refs.eduExperience.eduExperiences,
				// 校园经历
				schoolExperiences: this.$refs.schoolExperience.schoolExperiences,
				// 项目经历
				projectExperiences: this.$refs.projectExperience.projectExperiences,
				// 实习经历
				practiceExperiences: this.$refs.practiceExperience.practiceExperiences,
				// 专业技能
				projectSkill: this.$refs.projectSkill.projectSkill,
				// 荣誉情况
				honors: this.$refs.honors.honors,
				// 自我描述
				intro: this.$refs.selfDescription.intro
			}
			getApp().globalData.gResume = {...data}
			putResume(data)
			.then(res => {
				this.gToastSuccess("简历保存成功")
			})
		},
		/*
			name: 预览简历
			description: 保存数据并跳转预览界面
			input: null
			return: null
		*/
		preview()
		{
			this.commitResume()
			uni.navigateTo({
				url: "./ResumePreview"
			})
		}
	},
	onLoad() {
		getResume(getApp().globalData.gUserInfo.phone)
		.then(res => {
			getApp().globalData.gResume = res.data
			this.loaded = true
			timer = setInterval(() => {
				this.commitResume()
			},30000)
		})
	},
	beforeDestroy() {
		clearInterval(timer)
		this.commitResume()
	},
	components:{
		BaseInfo,
		EduExperience,
		SchoolExperience,
		ProjectExperience,
		PracticeExperience,
		ProSkill,
		Honors,
		SelfDescription
	}
}
</script>

<style lang="stylus">
.resume
	position relative
	padding 30rpx 30rpx 100rpx 
	background-color var(--white1)
	/* 不同种类卡片 */
	.card
		margin-bottom 15px
		padding 40rpx 60rpx
		background-color #FFFFFF
		filter brightness(98%)
		border-radius 22px
		overflow hidden
		/* 折叠图标 */
		.fold
			position absolute
			right 30rpx
			top 30rpx
			color var(--origin1)
			font-size 40rpx
			transition .4s
		// 大标题
		.h3
			color var(--origin1)
		/* 小字提示 */
		.small
			margin-top 10px
			color var(--gray2)
		// 子元素
		.item
			position relative
			margin 20rpx 0
			display flex
			align-items center
			// 开头提示文字
			text
				margin-right 20rpx
				color var(--origin2)
				white-space nowrap
			// 输入框
			.input
				padding 0 15rpx
				background-color var(--origin3)
				border-radius 20px
				font-size 28rpx
		/* textarea输入 */
		textarea
			margin-top 15rpx
			width 100%
			padding 15rpx
			background-color var(--origin3)
			border-radius 15px
			font-size 28rpx
		// 添加按键
		.add-btn
			margin-top 30rpx
			border 1px solid var(--origin2)
			background-color transparent
			color var(--origin2)
			font-size 28rpx
			padding 5rpx
		/* 多组中单个样式 */
		.list-itme
			position relative
			margin-bottom 0 30px
			border-bottom 2px dotted var(--origin2)
			/* 删除图标 */
			.remove
				position absolute
				right -20rpx
				top 0
				color #e86452
				font-size 40rpx
			/* 最后一项不加边框 */
			&:last-of-type
				border none
	/* 功能按键 */
	.btns
		position fixed
		bottom 0
		left 0
		right 0
		height 120rpx
		background-color var(--origin2)
		border-top-left-radius 22px
		border-top-right-radius 22px
		display flex
		align-items center
		justify-content space-around
		.small
			flex 1
		button
			height 80rpx
			width 30%
		.preview
			background-color transparent
			border-radius 12px
			color #FFFFFF
			border 1px dotted #FFFFFF
		.save
			background-color #FFFFFF
			color var(--origin2)
</style>
