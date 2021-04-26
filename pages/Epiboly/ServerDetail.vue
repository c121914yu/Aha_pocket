<!-- 服务详细页 -->
<template>
	<div class="server">
		<view class="header">
			<view class="base-info">
				<Avatar :src="avatar"></Avatar>
				<view class="right">
					<view class="name strong">{{name}}</view>
					<UserTags class="tags" :tags="tags"></UserTags>
					<view class="time mini">{{time}}</view>
				</view>
			</view>
			<view class="server-evaluate">
				<view class="way">
					<view><text class="label">交付时间:</text><text class="value">{{paytime}}</text></view>
					<view><text class="label">质保时间:</text><text class="value">{{guaranteeTime}}</text></view>
				</view>
				<view class="price">￥{{price}}</view>
				<view class="footer">
					<view class="sales">成交: 5</view>
					<view class="grade">评分: 5.0</view>
					<div class="collect"><text class="iconfont icon-collection"></text>5</div>
				</view>
			</view>
		</view>
		<!-- 导航条 -->
		<TopNavs :navs="navs" color="var(--black)" backgroundColor="#fff"></TopNavs>
		<!-- 服务信息卡片 -->
		<view class="card">
			<view class="title">提供者</view>
			<!-- 用户信息 -->
			<view class="val user">
				<Avatar :src="server.avatarUrl" size="50"></Avatar>
				<view class="right">
					<view class="name">
						<text class="strong">{{server.nickname}}</text><UserLevel point="50" small></UserLevel>
					</view>
					<UserTags :tags="userTags"></UserTags>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="title">图片集</view>
		</view>
		<view class="card">
			<view class="title">内容详情</view>
		</view>
		<view class="card">
			<view class="title">评论</view>
		</view>
	</div>
</template>

<script>
export default{
	data(){
		return{
			avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
			name: "企业LOGO设计搭嘎撒帝国时代多个都是搞啥地方函数返回",
			tags: ["第三个沙发的高度是否","srdgsd0","浮点数高繁琐"],
			time: "2020/8/2",
			payway: "人工服务",
			guaranteeTime: 20,
			paytime: "20天",
			price: 150,
			navs: [
				{label: "提供者",id: "1"},
				{label: "图片集",id: "2"},
				{label: "内容详情",id: "3"},
				{label: "评论",id: "4"},
			],
			server: getApp().globalData.gUserInfo.userInfo
		}
	},
	computed: {
		userTags(){
			if(!this.server || !this.server.specialtyTags){
				return []
			}
			return this.server.specialtyTags.split(",")
		}
	},
	methods:{
		
	}
}
</script>

<style lang="stylus" scoped>
.server
	background-color var(--white1)
	min-height 100vh
	.header
		padding 10px 5%
		background-color var(--origin4)
		.base-info
			display flex
			.right
				margin-left 15px
				.name
					margin-bottom 5px
					font-size 24rpx
				.time
					color var(--gray2)
		.server-evaluate
			padding 10px
			border-radius 22px
			background-color #FFFFFF
			.price
				font-size 50rpx
				color var(--origin1)
			.way
				float right
				padding 0 5px 0 10px
				border-left var(--border2)
				.label
					margin-right 5px
					color var(--gray2)
				.value
					color var(--origin2)
					font-weight 700
			.footer
				margin-top 15px
				font-size 24rpx
				display flex
				align-items center
				.grade
					margin-left 10px
					flex 1
				.collect
					margin-right 15px
					color var(--origin1)
				.iconfont
					margin-right 2px
					font-size 24rpx
	/* 服务卡片 */
	.card
		margin 10px 3%
		padding 10px 15px
		border-radius 22px
		background-color #FFFFFF
		.title
			font-weight 700
			padding-left 5px
			border-left 7px solid var(--origin2)
			line-height 1
		.val
			margin-top 5px
			padding-top 8px
			border-top var(--border2)
		.user
			display flex
			.right
				margin-left 20px
				.name
					margin-bottom 10px
					display flex
					text
						margin-right 10px
</style>
