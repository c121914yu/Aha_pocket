<template>
	<view class="project">
		<!-- 标题名称 -->
		<view class="head">{{project.name}}</view>
		<view class="line"></view>
		<!-- 成员信息 -->
		<view class="members">
			<text class="iconfont icon-renyuan"></text>
			<view 
				class="member"
				v-for="(member,index) in project.members"
				:key="index">
				{{member.trueName}}
			</view>
		</view>
		<!-- 获奖情况 -->
		<view class="award" v-if="project.compName">
			<text class="strong iconfont icon-canjiaxiaowaijingsai"></text>
			<text>{{project.awardTime}} {{project.compName}} {{awardLevel}}</text>
		</view>
		<!-- 标签 -->
		<view v-if="project.tags" class="tags">
			<text class="iconfont icon-biaoqian"></text>
			{{tags}}
		</view>
		<!-- 阅读量/收藏率 -->
		<view class="read-collect">
			<view class="read">
				<text class="iconfont icon-readed"></text>
				<text>{{project.read}}</text>
			</view>
			<view class="collect">
				<text class="iconfont icon-collection"></text>
				<text>{{project.collect}}</text>
			</view>
		</view>
		<!-- 项目介绍 -->
		<view class="intro" v-if="project.intro">
			<view class="h3">项目介绍</view>
			<view class="html" v-html="project.intro"></view>
		</view>
		<!-- 附近列表 -->
		<view class="files" v-if="project.resources.length>0">
			<view class="h3">附近列表</view>
			<view 
				class="file"
				v-for="(file,index) in project.resources"
				:key="index">
				{{file.name}}
			</view>
		</view>
	</view>
</template>

<script>
import { getProject } from "@/static/request/api_project.js"
export default {
	data() {
		return {
			project: null,
		}
	},
	computed: {
		awardLevel(){
			const grade = getApp().globalData.prizeGrades.find(item => item.value === this.project.awardLevel)
			if(grade)
				return grade.label
			return ""
		},
		tags(){
			if(!this.project.tags)
				return ""
			return this.project.tags.replace(" ",",")
		}
	},
	methods: {
		
	},
	onLoad(e) {
		getProject(e.id)
		.then(res => {
			this.project = res.data
			console.log(this.project);
		})
	}
}
</script>

<style lang="stylus" scoped>
.project
	padding 10px
	.head
		color var(--origin1)
		font-size 40rpx
		font-weight 700
	.line
		height 1px
		width 100%
		background-color var(--gray2)
	.iconfont
		margin-right 5px
	.members
		display flex
		align-items center
		flex-wrap wrap
		color var(--gray2)
		.member
			margin-right 10px
	.award
		font-size 28rpx
		color var(--origin2)
	.tags
		color var(--origin1)
	.read-collect
		color #5d7092
		display flex
		.read
			margin-right 10px
	.intro
		.h3
			color var(--origin2)
	.files
		.h3
			color var(--origin1)
		.file
			margin 5px 0
			text-decoration underline
			color var(--origin2)
			font-size 26rpx
</style>
