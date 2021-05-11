<!-- 
	简历预览
	author yjl
-->
<template>
	<view class="preview">
		<!-- 下载按键 -->
		<icon 
			class="download" 
			type="download" 
			size="30" 
			color="#f8b62d" 
			@click="onclickDownload">
		</icon>
		<!-- 基本信息 -->
		<view class="part base-info">
			<!-- 姓名 -->
			<view class="name center">{{ name }}</view>
			<!-- 求职意愿 -->
			<view class="center">(工作意愿: {{ workPlace }} {{ profession }})</view>
			<!-- 基础信息1 -->
			<view>{{ gender }}&emsp;{{ age }}岁&emsp;{{ highestDegree }}{{ identity === '学生' ? '在读' : '毕业' }}&emsp;{{ currentGrade }}</view>
			<!-- 基础信息2 -->
			<view>{{ phone }} | {{ email }}</view>
		</view>
		<!-- 教育经历 -->
		<view v-if="eduExperiences.length > 0" class="part eduExper">
			<view class="h3">教育经历</view>
			<view 
				class="item" 
				v-for="(edu, index) in eduExperiences" 
				:key="index">
				<view class="head">
					<text class="strong">{{ edu.school }}</text>
					<text class="time">{{ edu.startTime}}-{{ edu.endTime}}</text>
				</view>
				<view>{{ edu.specialty }}/{{ edu.degree }}</view>
				<view>成绩排名: {{ edu.grade }}</view>
			</view>
		</view>
		<!-- 实习经历 -->
		<view v-if="practiceExperiences.length > 0" class="part practiceExper">
			<view class="h3">实习经历</view>
			<view 
				class="item" 
				v-for="(exper, index) in practiceExperiences" 
				:key="index">
				<view class="head">
					<view class="strong">{{ exper.company }}</view>
					<view class="time">{{ exper.startTime}}-{{ exper.endTime}}</view>
				</view>
				<view>{{ exper.post }}</view>
				<view class="description">{{ exper.description }}</view>
			</view>
		</view>
		<!-- 项目经历 -->
		<view v-if="projectExperiences.length > 0" class="part projectExper">
			<view class="h3">项目经历</view>
			<view 
				class="item" 
				v-for="(exper, index) in projectExperiences" 
				:key="index">
				<view class="head">
					<view class="strong">{{ exper.name }}</view>
					<view class="time">{{ exper.startTime}}-{{ exper.endTime}}</view>
				</view>
				<view>{{ exper.content }}</view>
				<view class="description">{{ exper.description }}</view>
			</view>
		</view>
		<!-- 校园经历 -->
		<view v-if="schoolExperiences.length > 0" class="part schoolExper">
			<view class="h3">校园经历</view>
			<view 
				class="item" 
				v-for="(exper, index) in schoolExperiences" 
				:key="index">
				<view class="head">
					<view class="strong">{{ exper.organization }}</view>
					<view class="time">{{ exper.startTime}}-{{ exper.endTime}}</view>
				</view>
				<view>{{ exper.post }}</view>
				<view class="description">{{ exper.description }}</view>
			</view>
		</view>
		<!-- 荣誉情况 -->
		<view v-if="honors.length > 0" class="part eduExper">
			<view class="h3">荣誉情况</view>
			<view 
				class="item" 
				v-for="(honor, index) in honors" 
				:key="index">
				<view class="head">
					<view class="strong">{{ honor.name }}</view>
					<view class="time">{{ honor.time}}</view>
				</view>
				<view class="description">{{ honor.description }}</view>
			</view>
		</view>
		<!-- 专业技能 -->
		<view v-if="projectSkill" class="part projectSkill">
			<view class="h3">个人技能</view>
			<view class="small">{{ projectSkill }}</view>
		</view>
		<!-- 自我介绍 -->
		<view v-if="intro" class="part intro">
			<view class="h3">自我介绍</view>
			<view class="small">{{ intro }}</view>
		</view>
	</view>
</template>

<script>
import { getResume } from '@/static/request/api_userInfo.js';
export default {
	data() {
		return {
			name: '',
			phone: '',
			email: '',
			gender: '',
			birth: '',
			highestDegree: '',
			identity: '',
			currentGrade: '',
			workPlace: '',
			profession: '',
			eduExperiences: [],
			schoolExperiences: [],
			projectExperiences: [],
			practiceExperiences: [],
			projectSkill: '',
			honors: [],
			intro: ''
		};
	},
	computed: {
		age() {
			return Math.floor((Date.now() - new Date(this.birth)) / 1000 / 60 / 60 / 24 / 365);
		}
	},
	onLoad(e) {
		if (e.userId) {
			getResume(e.userId)
			.then(res => {
				const resume = res.data
				for (let key in resume){
					this[key] = resume[key];
				} 
			})
		} 
		else {
			const resume = getApp().globalData.gResume;
			for (let key in resume){
				this[key] = resume[key];
			} 
		}
	},
	methods: {
		onclickDownload() {}
	},
};
</script>

<style lang="stylus" scoped>
.preview
	min-height 100vh
	padding 20px
	color var(--black)
	/* 下载按键 */
	.download
		position absolute
		right 10px
		top 10px
	/* 每个模块公有样式 */
	.part
		margin-bottom 10px
		width 100%
		padding-bottom 5px
		border-bottom var(--border1)
		white-space pre-wrap
		line-height 1.8
		&:last-of-type
			border none
		.h3
			position relative
			margin 5px 0
			line-height 1
			padding-left 10px
			&::before
				content ''
				position absolute
				height 100%
				width 5px
				left 0
				background-color var(--origin2)
				border-radius 20px
		.item
			margin 12px 0
			padding-left 5px
			.head
				display flex
				.strong
					flex 1
			.time
				font-size 22rpx
				color var(--gray2)
			.description
				font-size 24rpx
				color var(--gray1)
	/* 基本信息 */
	.base-info
		view
			margin 5px 0
		.name
			font-size 50rpx
			font-weight 600
</style>
