<template>
	<!-- 个人简历 -->
	<view class="resume">
		<!-- 基本信息卡片 -->
		<BaseInfo ref="baseInfo"></BaseInfo>
		<!-- 教育经历 -->
		<EduExperience ref="eduExperience"></EduExperience>
		<!-- 校园经历 -->
		<SchoolExperience ref="projectExperience"></SchoolExperience>
		<!-- 项目经历 -->
		<ProjectExperience></ProjectExperience>
		<!-- 专业技能卡片 -->
		<ProSkill ref="projectSkill"></ProSkill>
		<!-- 荣誉情况 -->
		<Honors ref="honors"></Honors>
		<!-- 自我介绍 -->
		<SelfDescription ref="selfDescription"></SelfDescription>
		<!-- 按键 -->
		<view class="btns">
			<button class="preview" @click="preview">预览</button>
			<text class="small center">自动保存中\n......</text>
			<button class="save" @click="save">保存</button>
		</view>
	</view>
</template>

<script>
import BaseInfo from "./ResumeComp/BaseInfo.vue"
import EduExperience from "./ResumeComp/EduExperience.vue"
import SchoolExperience from "./ResumeComp/SchoolExperience.vue"
import ProjectExperience from "./ResumeComp/ProjectExperience.vue"
import ProSkill from "./ResumeComp/ProSkill.vue"
import Honors from "./ResumeComp/Honors.vue"
import SelfDescription from "./ResumeComp/SelfDescription.vue"
export default {
	data() {
		return {
		}
	},
	methods: {
		/* 
			name: 保存个人简历
			description: 获取各组件的内容构成简历数据
			input: null
			return: null
		*/
		save()
		{
			const data = {
				// 基础信息表
				name: this.$refs.baseInfo.name,
				contact: this.$refs.baseInfo.contact,
				gender: this.$refs.baseInfo.gender,
				both: this.$refs.baseInfo.both,
				highestDegree: this.$refs.baseInfo.highestDegree,
				identity: this.$refs.baseInfo.identity,
				currentGrade: this.$refs.baseInfo.currentGrade,
				workPlace: this.$refs.baseInfo.workPlace,
				profession: this.$refs.baseInfo.profession,
				// 教育经历
				eduExperience: this.$refs.eduExperience.eduExperience,
				// 项目经历
				projectExperience: this.$refs.projectExperience.experiences,
				// 专业技能
				projectSkill: this.$refs.projectSkill.proSkill,
				// 荣誉情况
				honors: this.$refs.honors.honorList,
				// 自我描述
				selfDescription: this.$refs.selfDescription.selfDescription
			}
			console.log(data)
		}
	},
	components:{
		BaseInfo,
		EduExperience,
		SchoolExperience,
		ProjectExperience,
		ProSkill,
		Honors,
		SelfDescription
	}
}
</script>

<style lang="stylus">
.resume
	min-height 100vh
	padding 30rpx 30rpx 100rpx 
	background-color var(--origin2)
	/* 不同种类卡片 */
	.card
		margin-bottom 15px
		padding 40rpx 60rpx
		background-color #FFFFFF
		filter brightness(99%)
		border-radius 22px
		// 大标题
		.h3
			color #F39800
		// 小字提示
		.small
			color var(--gray-font)
		// 子元素
		.item
			position relative
			margin 20rpx 0
			display flex
			align-items center
			// 开头提示文字
			text
				margin-right 20rpx
				color var(--origin4)
				white-space nowrap
			// 输入框
			.input
				padding 5rpx 15rpx
				background-color var(--origin2)
				border-radius 20px
		/* textarea输入 */
		textarea
			margin-top 15rpx
			width 100%
			padding 15rpx
			background-color var(--origin2)
			border-radius 15px
		// 添加按键
		.add-btn
			margin-top 30rpx
			border 1px solid var(--origin4)
			background-color transparent
			color var(--origin4)
			font-size 28rpx
			padding 5rpx
		/* 多组中单个样式 */
		.list-itme
			position relative
			margin-bottom 0 30px
			border-bottom 2px dotted var(--origin4)
			/* 删除图标 */
			.remove
				position absolute
				right -20rpx
				top 0
			/* 最后一项不加边框 */
			&:last-of-type
				border none
	/* 功能按键 */
	.btns
		position fixed
		bottom 0
		left 0
		right 0
		height 100rpx
		width 100%
		padding 0 5%
		background-color var(--origin4)
		border-top-left-radius 20px
		border-top-right-radius 20px
		display flex
		align-items center
		justify-content space-around
		.small
			flex 1
		button
			height 80rpx
			width 30%
			line-height 80rpx
			font-size 30rpx
			&.preview
				background-color transparent
				color #FFFFFF
				border 1px dotted #FFFFFF
</style>
