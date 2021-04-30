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
			<navigator
				hover-class="none"
				class="val user"
				:url="'../Self/UserHome?userId=112'">
				<Avatar :src="server.avatarUrl" size="50"></Avatar>
				<view class="right">
					<view class="name">
						<text class="strong">{{server.nickname}}</text><UserLevel point="50" small></UserLevel>
					</view>
					<UserTags :tags="userTags"></UserTags>
				</view>
			</navigator>
		</view>
		<!-- 图片集 -->
		<view class="card">
			<view class="title">图片集({{images.length+1}})</view>
			<view class="val images">
				<view 
					class="image"
					v-for="(url,i) in images"
					:key="i"
					@click="gReadImage(images,i)">
					<image :src="url" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<!-- 详细介绍 -->
		<view class="card">
			<view class="title">内容详情</view>
			<view v-if="intro" class="val" v-html="intro"></view>
			<view v-else class="val small center">
				暂无详细介绍
			</view>
		</view>
		<!-- 评论 -->
		<view class="card">
			<view class="title">评论</view>
			<view class="val">
				<view 
					class="comment"
					v-for="item in 5"
					:key="item">
					<view class="user-info">
						<Avatar 
							src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png" 
							size="35"
							bgColor="none">
						</Avatar>
						<view class="right">
							<view class="name">的时光回溯多喝个</view>
							<view class="time">2020-7-1</view>
						</view>
					</view>
					<EllipsisText text="Lorem ipsum dolor sit amet, consectetur adipisicing elpudiandae fugit labore va culpa ipsam iste beatae tempore distinctio quod omnis similique nisi incidunt ducimus. nam explicabo."></EllipsisText>
					<!-- 回复 & 点赞-->
					<view class="interaction">
						<navigator 
							hover-class="none"
							class="item reply" 
							url="../Comment/CommentDetail">
							<text class="iconfont icon-xinxi"></text>
							<text style="margin: 0 3px;">回复</text>
							<text>5</text>
						</navigator>
						<view class="item good">
							<text class="iconfont icon-start"></text>
							<text style="margin: 0 3px;">点赞</text>
							<text>5</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部菜单栏 -->
		<view class="menu">
			<view class="price">
				￥{{price}}
			</view>
			<view class="collect">
				<text class="iconfont icon-shoucang"></text>
				<view>收藏</view>
			</view>
			<navigator hover-class="none" class="contact" :url="'../Self/Inform/Inform_send?id=' + 112">
				联系作者
			</navigator>
			<view class="buy">
				购买服务
			</view>
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
			server: getApp().globalData.gUserInfo.userInfo,
			images: [
				"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
				"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/user_files/112/1612603373231.JPG",
				"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/user_files/113/1612694966703.JPG",
				"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/user_files/113/1619367730928.JPG",
				"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
			],
			intro: ""
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
	padding-bottom 50px
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
		.images
			display flex
			 overflow-x auto
			 &::-webkit-scrollbar
				display none
			 .image
				margin-right 1%
				flex 1 0 32%
				max-height 30vw
				border-radius 8px
				display flex
				align-items center
				image
					width 100%
		.comment
			margin-bottom 5px
			padding-bottom 5px
			border-bottom var(--border2)
			&:last-of-type
				border-bottom none
			.user-info
				display flex
				.right
					margin-left 10px
					.name
						font-size 24rpx
					.time
						font-size 20rpx
						color var(--gray2)
			.content
				display -webkit-box
			.interaction
				margin-top 10px
				display flex
				justify-content space-between
				align-items center
				.item
					font-size 22rpx
					display flex
					align-items center
					.iconfont
						font-size 24rpx
	.menu
		position fixed
		bottom 0
		width 100%
		background-color #FFFFFF
		box-shadow var(--shadow1)
		display flex
		align-items center
		text-align center
		.price
			padding 0 15px
			font-size 30rpx
			font-weight 700
			color var(--origin1)
		.collect
			padding 0 15px
			line-height 1.2
			font-size 24rpx
			.iconfont
				font-size 24rpx
		.contact,.buy
			flex 1
			padding 10px 0
			color #FFFFFF
		.contact
			background-color var(--origin2)
		.buy
			background-color #e86452
</style>
