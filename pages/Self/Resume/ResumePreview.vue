<!-- 简历预览 -->
<template>
	<view v-if="loaded" class="preview">
		<!-- 下载按键 -->
		<icon class="download" type="download" size="30" color="#f8b62d" @click="download"></icon>
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
			<view class="item" v-for="(edu, index) in eduExperiences" :key="index">
				<view>{{ edu.startTime.replace('-', '.') }} - {{ edu.endTime.replace('-', '.') }}&emsp;{{ edu.degree }}&emsp;{{ edu.school }}</view>
				<view>{{ edu.specialty }}&emsp;成绩排名{{ edu.grade }}</view>
			</view>
		</view>
		<!-- 实习经历 -->
		<view v-if="practiceExperiences.length > 0" class="part practiceExper">
			<view class="h3">实习经历</view>
			<view class="item" v-for="(exper, index) in practiceExperiences" :key="index">
				<view>{{ exper.startTime.replace('-', '.') }} - {{ exper.endTime.replace('-', '.') }}</view>
				<view class="main">{{ exper.company }}&emsp;{{ exper.post }}</view>
				<view class="description">{{ exper.description }}</view>
			</view>
		</view>
		<!-- 项目经历 -->
		<view v-if="projectExperiences.length > 0" class="part projectExper">
			<view class="h3">项目经历</view>
			<view class="item" v-for="(exper, index) in projectExperiences" :key="index">
				<view>{{ exper.startTime.replace('-', '.') }} - {{ exper.endTime.replace('-', '.') }}</view>
				<view class="main">项目名称: {{ exper.name }}</view>
				<view class="main">负责内容: {{ exper.content }}</view>
				<view class="description">{{ exper.description }}</view>
			</view>
		</view>
		<!-- 校园经历 -->
		<view v-if="schoolExperiences.length > 0" class="part schoolExper">
			<view class="h3">校园经历</view>
			<view class="item" v-for="(exper, index) in schoolExperiences" :key="index">
				<view>{{ exper.startTime.replace('-', '.') }} - {{ exper.endTime.replace('-', '.') }}</view>
				<view class="main">{{ exper.organization }}&emsp;{{ exper.post }}</view>
				<view class="description">{{ exper.description }}</view>
			</view>
		</view>
		<!-- 荣誉情况 -->
		<view v-if="honors.length > 0" class="part eduExper">
			<view class="h3">荣誉情况</view>
			<view class="item" v-for="(honor, index) in honors" :key="index">
				<view>{{ honor.time.replace('-', '.') }}&emsp;{{ honor.name }}</view>
				<view class="description">{{ honor.description }}</view>
			</view>
		</view>
		<!-- 专业技能 -->
		<view v-if="projectSkill" class="part projectSkill">
			<view class="h3">个人技能</view>
			<view style="margin-top: 5px">{{ projectSkill }}</view>
		</view>
		<!-- 自我介绍 -->
		<view v-if="intro" class="part intro">
			<view class="h3">自我介绍</view>
			<view style="margin-top: 5px">{{ intro }}</view>
		</view>
	</view>
</template>

<script>
import { getResume } from '@/static/request/api_userInfo.js';
export default {
	data() {
		return {
			loaded: false,
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
	methods: {
		/* 
			name: 下载界面
			description: 将整页下载成pdf文件
			input: null
			return: null
			time: 2020/10/22
		*/
		download() {}
	},
	onLoad(e) {
		if (e.userId) {
			getResume(e.userId).then(res => {
				console.log(res.data);
			});
		} else {
			const resume = getApp().globalData.gResume;
			for (let key in resume){
				this[key] = resume[key];
			} 
			this.loaded = true;
		}
	}
};
</script>

<style lang="stylus" scoped>
.preview
	min-height 100vh
	padding 40rpx
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
		border-bottom 1px solid #9fa0a0
		color #333333
		white-space pre-wrap
		&:last-of-type
			border none
		.h3
			padding-left 10px
			border-left 10px solid var(--origin3)
		.item
			margin 12px 0
			font-size 30rpx
			font-weight 600
			.main
				font-size 32rpx
			.description
				font-weight 400
	/* 基本信息 */
	.base-info
		view
			margin 5px 0
		.name
			font-size 50rpx
			font-weight 600
</style>
