<!-- 资源卡片 -->
<template>
	<view 
		class="resource-card"
		:style="{
			'margin': margin,
			'border-radius': radius
		}">
		<!-- 排名图标 -->
		<text v-if="ranking!==0" :class="'ranking iconfont ' + rankingIcon"></text>	
		<!-- 头像 -->
		<view class="logo">
			<image :src="resource.logoUrl" mode="widthFix"></image>
		</view>
		<!-- 资源信息 -->
		<view 
			class="info"
			:class="border ? 'border' : ''">
			<!-- 资源名称 -->
			<view class="name strong">{{resource.name}}</view>
			<!-- 获奖信息 -->
			<view class="prize">
				<view class="prize-name"><text class="strong">获奖赛事: </text>{{resource.prize.name}}</view>
				<view class="grade">{{resource.prize.time}} {{resource.prize.grade}}</view>
			</view>
			<!-- 标签 -->
			<view class="tags">{{tags}}</view>
			<!-- 数据统计 -->
			<view class="statistics">
				<view>
					<text class="iconfont icon-readed"></text>
					<text>1000</text>
				</view>
				<view>
					<text class="iconfont icon-collection"></text>
					<text>{{resource.collection}}</text>
				</view>
			</view>
			<!-- 收藏按键 -->
			<text class="collection iconfont icon-collection"></text>	
		</view>
	</view>
</template>

<script>
export default {
	props: {
		resource: {
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
		tags(){
			return this.resource.tags.join(",")
		}
	}
}
</script>

<style lang="stylus" scoped>
.resource-card
	background-color #FFFFFF
	padding 5px
	display flex
	.ranking
		color var(--origin2)
		font-size 40rpx
		display flex
		align-items center
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
		height 100%
		font-size 24rpx
		&.border
			border-bottom 1px solid var(--origin2)
		.name
			color var(--origin2)
			font-size 26rpx
		.tags
			display flex
			flex-wrap wrap
			.tag
				margin-right 5px
		/* 统计量 */
		.statistics
			color var(--origin2)
			display flex
			align-items center
			view
				margin-right 5px
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
