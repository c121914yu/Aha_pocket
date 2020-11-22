<!-- 用户信息主页 -->
<template>
	<view class="user-home">
		<view class="head">
			<!-- 标签 -->
			<view 
				class="tag"
				:style="{
					transform: `translate(${translate[index][0]}px,${translate[index][1]}px)`
				}"
				v-for="(tag,index) in tags"
				:key="index">
				{{tag}}
			</view>
			<!-- 头像 & 昵称 -->
			<view class="info">
				<image :src="avatarUrl"></image>
				<view>{{nickname}}</view>
			</view>
		</view>
		<!-- 个人介绍 -->
		<view class="intro">
			<view class="h3">个人介绍</view>
			<view class="small">{{intro || "这个人还没填写简历..."}}</view>
		</view>
		<!-- 经历统计 -->
		<view 
			class="list">
			<view class="title">
				<view class="name">项目参与数量</view>
				<view class="amount">10</view>
				<text class="iconfont icon-xiala"></text>
			</view>
			<navigator 
				class="item"
				hover-class="none"
				v-for="(item,index) in projects"
				:key="index">
				<view class="name">{{item.name}}</view>
				<view class="collect"><text class="iconfont icon-collection"></text>{{item.collect}}</view>
				<text class="go iconfont icon-arrow-right"></text>
			</navigator>
		</view>
	</view>
</template>

<script>
import { getUser } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			avatarUrl: "https://aha-public.oss-cn-hangzhou.aliyuncs.com/avatar/15677751219/avatar.JPG",
			nickname: "余金隆",
			specialtyTags: "前端,小程序,数据挖掘",
			compTags: "服务外包,互联网+,挑战杯",
			tags: [],
			translate: [],
			
			intro: "大概大叔大婶考山东矿机高点击可我德生科技殴打首付款佳都科技搜奋达科技哦搜狗科技没发动开局们的是佛教是搜会计法度搜漱口漱口考上框架的噢上框架佛匹配偶数",
			projects: [
				{name: "搭嘎大是",collect: 10},
				{name: "搭嘎大是",collect: 10},
				{name: "搭嘎大是",collect: 10},
				{name: "搭嘎大是",collect: 10},
			],
			
			showProject: false,
		}
	},
	methods: {
		/* 移动标签位置 */
		moveTag()
		{
			for(let i=0;i<this.translate.length;i++){
				let X = 0
				let Y = 0
				
				switch((i+1) % 6){
					case 1: X=75;break;
					case 2: X=70;break;
					case 3: X=70;break;
					case 4: X=-90;break;
					case 5: X=-80;break;
					case 0: X=-80;break;
				}
				
				switch((i+1) % 3){
					case 1: Y=0;break; // 24
					case 2: Y=-30;break; // 15
					case 0: Y=30;break; // 36
				}
				this.translate[i] = [X,Y]
			}
			setTimeout(() => {
				this.$forceUpdate()
			},10)
		}
	},
	onLoad(e) {
		console.log(e);
		if(!e.phone)
			this.gToastError("出现小错误...")
		else
			/* 获取用户手机号，请求数据 */
			getUser(e.phone)
			.then(res => {
				console.log(res)
				this.tags = this.specialtyTags.split(",").concat(this.compTags.split(",")).map(tag => {
					this.translate.push([0,0])
					return tag
				})
				this.$nextTick(this.moveTag)
			})
	}
}
</script>

<style lang="stylus" scoped>
.user-home
	min-height 100vh
	background-color var(--white1)
	.head
		height 120px
		background-color var(--origin3)
		display flex
		align-items center
		justify-content center
		.info
			z-index 5
			height 100%
			display flex
			flex-direction column
			align-items center
			justify-content center
			view
				color var(--origin1)
			image
				width 80px
				height 80px
				border-radius 50%
		.tag
			z-index 6
			position absolute
			top 40px
			margin 3px
			padding 0 5px
			border-radius 10px
			background-color var(--origin1)
			color #FFFFFF
			font-size 22rpx
			white-space nowrap
			display inline-block
			transition .5s
			&:nth-child(1)
				transition-delay 0
			&:nth-child(2)
				transition-delay .1s
			&:nth-child(3)
				transition-delay .2s
			&:nth-child(4)
				transition-delay .4s
			&:nth-child(5)
				transition-delay .5s
			&:nth-child(6)
				transition-delay .3s
	.intro
		margin-top 10px
		padding 10px
		background-color #FFFFFF
	/* 统计数据 */
	.list
		margin 10px 5px 0 5px
		// height 40px
		// overflow hidden
		.title
			position relative
			height 40px
			padding 0 10px
			background-color var(--origin3)
			border-radius 12px
			display flex
			align-items center
			.name
				flex 1
			.amount
				margin-right 30px
				height 30px
				width 30px
				line-height 30px
				text-align center
				border-radius 50%
				background-color #FFFFFF
			.iconfont
				position absolute
				right 10px
				color var(--origin1)
				font-size 32rpx
		.item
			width 85%
			margin 10px auto
			padding 10px
			background-color #FFFFFF
			border-radius 8px
			font-size 24rpx
			display flex
			align-items center
			.name
				flex 1
				font-size 26rpx
			.collect
				margin 0 10px
				color var(--origin2)
			.go
				font-size 40rpx
				color var(--origin1)
</style>
