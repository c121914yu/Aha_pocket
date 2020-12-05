<!-- 资源卡片 -->
<template>
	<view 
		class="project-card"
		:style="{
			'margin': margin,
			'border-radius': radius,
			'background-color': project.passed ? '#ffffff' : 'rgba(248,184,107,0.1)'
		}"
		@click="$emit('click')">
		<!-- 排名图标 -->
		<text v-if="ranking!==0" :class="'ranking iconfont ' + rankingIcon"></text>	
		<!-- 头像 -->
		<view class="logo">
			<image 
				:src="project.avatarUrl || 'https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png'" 
				mode="widthFix">
			</image>
		</view>
		<!-- 资源信息 -->
		<view 
			class="info"
			:class="border ? 'border' : ''">
			<!-- 资源名称 -->
			<view class="name strong">{{project.name}}</view>
			<!-- 获奖信息 -->
			<view class="prize" v-if="project.compId !== 0">
				<view>{{project.awardTime}} {{awardLevel}}</view>
				<view class="strong">{{compName}}</view>
			</view>
			<!-- 标签 -->
			<view class="tags">{{tags}}</view>
			<!-- 数据统计 -->
			<view class="statistics">
				<view>
					<text class="iconfont icon-readed"></text>
					<text>{{project.read}}</text>
				</view>
				<view style="color: var(--origin1);">
					<text class="iconfont icon-collection"></text>
					<text>{{project.collect}}</text>
				</view>
			</view>
			<!-- 收藏按键 -->
			<text 
				v-if="showCollect" 
				class="collection iconfont icon-collection" 
				@click.stop="collect">
			</text>	
		</view>
	</view>
</template>

<script>
import { collectProject,cancleCollectProject } from "@/static/request/api_project.js"
export default {
	props: {
		project: {
			type: Object,
			default: () => {}
		},
		ranking: {
			type: Number,
			default: 0
		},
		border: {
			type: Boolean,
			default: false
		},
		margin: {
			type: String,
			default: "0"
		},
		radius: {
			type: String,
			default: "0"
		},
		showCollect: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		rankingIcon(){
			switch(this.ranking){
				case 1: return "icon-first"
				case 2: return "icon-second"
				case 3: return "icon-third"
				default: return ""
			}
		},
		compName(){
			if(this.project.compId !== 0){
				const match = getApp().globalData.Matches.find(match => match.compTagId === this.project.compId)
				if(match)
					return match.name
			}
			return ""
		},
		awardLevel(){
			if(this.project.awardLevel){
				let res = getApp().globalData.prizeLevels.find(item => item.value === this.project.awardLevel)
				if(res)
					return res.label
			}
			return ""
		},
		tags(){
			if(!this.project.tags)
				return ""
			return this.project.tags.replace(/\s+/g,",")
		}
	},
	methods: {
		collect()
		{
			console.log(this.project);
		}
	}
}
</script>

<style lang="stylus" scoped>
.project-card
	min-height 90px
	background-color #FFFFFF
	padding 5px
	display flex
	align-items center
	.ranking
		color var(--origin2)
		font-size 40rpx
		display flex
		justify-content center
	.logo
		margin 0 10px 0 5px 
		width 160rpx
		height 160rpx
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
		min-height 160rpx
		font-size 24rpx
		display flex
		flex-direction column
		&.border
			border-bottom 1px solid var(--origin2)
		.name
			flex 1
			color var(--origin2)
			font-size 26rpx
		.tags
			display flex
			flex-wrap wrap
			.tag
				margin 2px
		/* 统计量 */
		.statistics
			color var(--origin2)
			display flex
			align-items center
			view
				margin-right 10px
			.iconfont
				margin-right 3px
		/* 收藏按键 */
		.collection
			position absolute
			right 0
			bottom 0
			font-size 44rpx
			color var(--origin1)
</style>
