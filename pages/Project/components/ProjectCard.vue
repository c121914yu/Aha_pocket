<!-- 资源卡片 -->
<template>
	<view
		class="project-card"
		:style="{
			margin: margin,
			'border-radius': radius,
		}"
		@click="$emit('click')">
		<!-- 排名图标 -->
		<text v-if="ranking !== 0" :class="'ranking iconfont ' + rankingIcon"></text>
		<!-- 头像 -->
		<view class="logo"><image :src="project.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'" mode="widthFix"></image></view>
		<!-- 资源信息 -->
		<view class="info" :class="border ? 'border' : ''">
			<!-- 资源名称 -->
			<view class="head">
				<text class="name strong">{{ project.name }}</text>
				<image 
					v-if="awardImg" 
					class="award-img"
					:src="awardImg"
					mode="widthFix">
				</image>
			</view>
			<!-- 获奖信息 -->
			<view v-if="compName">
				<text class="comp-name strong">{{ compName }}</text>
			</view>
			<view v-else class="blank"></view>
			<!-- 标签 -->
			<view class="tags">
				<view 
					class="tag"
					v-for="(tag,index) in tags"
					:key="index">
					{{ tag }}
				</view>
			</view>
			<view class="blank"></view>
			<!-- 时间 & 数据统计 & 状态-->
			<view class="footer">
				<view class="time"><text v-if="compName && project.awardTime">{{ project.awardTime }}</text></view>
				<view class="read" :class="is_showStatus ? 'tranform' : ''">
					<text class="iconfont icon-readed"></text>
					<text>{{ project.read }}</text>
				</view>
				<view class="collect" :class="is_showStatus ? 'tranform' : ''">
					<text class="iconfont icon-collection"></text>
					<text>{{ project.collect }}</text>
				</view>
				<view 
					v-if="is_showStatus"
					class="status"
					:class="projectStatus.class"
					v-html="projectStatus.label">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { collectProject, cancleCollectProject } from '@/static/request/api_project.js';
export default {
	props: {
		project: {
			type: Object,
			default: () => {}
		},
		/* 是否显示排行 */
		ranking: {
			type: Number,
			default: 0
		},
		/* 是否显示下边框 */
		border: {
			type: Boolean,
			default: false
		},
		/* 间距 */
		margin: {
			type: String,
			default: '0'
		},
		/* 圆角 */
		radius: {
			type: String,
			default: '0'
		},
		/* 是否显示状态 */
		is_showStatus: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		rankingIcon() {
			switch (this.ranking) {
				case 1: return 'icon-first';
				case 2: return 'icon-second';
				case 3: return 'icon-third';
				default: return '';
			}
		},
		compName() {
			if (this.project.compId !== 0) {
				const match = getApp().globalData.Competitions.find(match => match.id === this.project.compId)
				if (match){
					return match.name;
				} 
			}
			return ""
		},
		awardImg() {
			if (this.project.awardLevel) {
				let res = getApp().globalData.prizeLevels.find(item => item.value === this.project.awardLevel)
				return res.src
			}
			return null
		},
		tags() {
			if (!this.project.tags) {
				return []
			}
			return this.project.tags.split(" ")
		},
		projectStatus() {
			if(this.project.isAnonymous){
				return {
					class: "anonymous",
					label: "匿&emsp;名"
				}
			}
			if(this.project.passed){
				return {
					class: "passed",
					label: "已通过"
				}
			}
			else{
				return {
					class: "failed",
					label: "审核中"
				}
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.project-card
	background-color #FFFFFF
	padding 5px
	display flex
	align-items center
	overflow hidden
	.ranking
		color var(--origin2)
		font-size 34rpx
	.logo
		margin 0 10px 0 5px
		width 57px
		height 57px
		background-color var(--origin3)
		border-radius 8px
		overflow hidden
		display flex
		align-items center
		justify-content center
		image
			width 100%
			height 100%
	/* 资源信息 */
	.info
		position relative
		flex 1
		min-height 57px
		font-size 18rpx
		line-height 1.2
		display flex
		flex-direction column
		&.border
			border-bottom 1px solid var(--origin2)
		.head
			height 18px
			display flex
			align-items flex-start
			.name
				flex 1
				font-size 20rpx
				overflow hidden
				text-overflow ellipsis
				white-space nowrap
			.award-img
				width 100rpx
				transform translateY(-5px)
		.comp-name
			padding 1px 12px
			background-color #F5A200
			color #FFFFFF
			border-radius 22px
		.tags
			display flex
			flex-wrap wrap
			.tag
				margin 4px 4px 0 0
				padding 1px 10px
				background-color #F8B500
				color #FFFFFF
				border-radius 22px
		/* 统计量 */
		.footer
			color var(--origin2)
			display flex
			align-items flex-end
			.time
				flex 1
				color var(--gray2)
			.read,.collect
				margin-right 10px
				color var(--origin1)
				display flex
				align-items center
				&.tranform
					transform translateX(25px)
			.iconfont
				margin-right 3px
				font-size 24rpx
			.status
				color #FFFFFF
				padding 2px 17px 12px
				font-size 22rpx
				transform rotate(-45deg) translate(29rpx,40rpx)
				// border-radius 5px
				&.passed
					background-color #67C23A
				&.failed
					background-color var(--gray2)
				&.anonymous
					background-color var(--gray1)
</style>
