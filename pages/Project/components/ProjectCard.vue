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
		<Avatar :src="project.avatarUrl" size="57"></Avatar>
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
			<view><text class="comp-name strong">{{ compName }}</text></view>
			<!-- 标签 -->
			<UserTags class="tags" :tags="tags"></UserTags>
			<view class="blank"></view>
			<!-- 时间 & 数据统计 & 状态-->
			<view class="footer">
				<view class="time">{{ project.awardTime }}</view>
				<view 
					class="read" 
					:class="(isShowAnonymous || isShowStatus) && projectStatus.class ? 'tranform' : ''">
					<text class="iconfont icon-readed"></text>
					<text>{{ project.read }}</text>
				</view>
				<view 
					class="collect" 
					:class="(isShowAnonymous || isShowStatus) && projectStatus.class ? 'tranform' : ''">
					<text class="iconfont icon-collection"></text>
					<text>{{ project.collect }}</text>
				</view>
				<view 
					v-if="(isShowAnonymous || isShowStatus) && projectStatus.class"
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
		isShowStatus: {
			type: Boolean,
			default: false
		},
		/* 是否显示匿名 */
		isShowAnonymous: {
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
				let res = getApp().globalData.garr_prizeLevels.find(item => item.value === this.project.awardLevel)
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
			if(!this.isShowStatus){
				return{
					class: "",
					label: ""
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
	/* 资源信息 */
	.info
		margin-left 10px
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
			position relative
			height 18px
			.name
				font-size 20rpx
				overflow hidden
				text-overflow ellipsis
				white-space nowrap
			.award-img
				position absolute
				right 0
				top -5px
				width 100rpx
		.comp-name
			padding 0 10px
			line-height 1.7
			background-color #F5A200
			color #FFFFFF
			border-radius 22px
			display inline-block
		.tags
			margin 5px
			min-height 30px
		/* 统计量 */
		.footer
			margin-top 5px
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
					transform translateX(30px)
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
