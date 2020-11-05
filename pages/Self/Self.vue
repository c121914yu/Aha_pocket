<template>
	<view class="self">
		<!-- 头部 -->
		<view class="head">
			<!-- 头像 -->
			<view class="avatar" @click="clickAvatar">
				<view class="bg bg3"></view>
				<view class="bg bg2"></view>
				<view class="bg bg1"></view>
				<image :src="userInfo.avatarUrl">
				</image>
			</view>
			<!-- 右侧昵称 & 标签 -->
			<view class="right">
				<!-- 昵称 -->
				<input 
					class="name" 
					:value="userInfo.nickname"
					maxlength="15"
					@blur="setNickName">
				</input>
				<!-- 标签 -->
				<view
					class="tags"
					@click="isCheckTags=true"
					>
					<view 
						class="tag small"
						v-for="(tag,index) in tags"
						:key="index">
						{{tag}}
					</view>
				</view>
			</view>
			<!-- 幕布 -->
			<view class="curtain" ref="curtain">
				<view class="one"></view>
				<view class="two"></view>
			</view>
		</view>
		<!-- 核心导航 招募 & 资源分享 -->
		<view class="navs">
			<navigator 
				hover-class="hoverScale"
				hover-stay-time	="50"
				url="/pages/Resource/UpResource">
				招募队友
			</navigator>
			<navigator
				hover-class="hoverScale"
				hover-stay-time	="50"
				url="/pages/Resource/UpResource">
				资源分享
			</navigator>
		</view>
		<!-- 任务 进行中 & 已完成 & 贡献详情 -->
		<view class="tasks">
			<navigator 
				class="task"
				v-for="(task,index) in tasks"
				:key="index"
				hover-class="none"
				:url="task.to">
				<text :class="'iconfont ' + task.icon"></text>
				<view>{{task.name}}</view>
			</navigator>
		</view>
		<!-- 功能列表 -->
		<view class="list">
			<navigator 
				class="item"
				:style="{
					'animationDelay': index*0.1 + 's'
				}"
				v-for="(item,index) in funtions"
				:key="index"
				hover-stay-time	="50"
				:url="item.to">
				<text :class="'iconfont ' + item.icon"></text>
				<text class="name">{{item.name}}</text>
				<text v-if="item.val" class="val">{{item.val}}</text>
				<text v-else class="right iconfont icon-arrow-right"></text>
			</navigator>
		</view>
		<!-- 兴趣选择 -->
		<SelectInterest v-if="isCheckTags" @close="isCheckTags=false"></SelectInterest>
	</view>
</template>

<script>
import { getAvatarOssSignature,putMe } from "@/static/request/api_userInfo.js"
export default {
	data() {
		const userInfo = {...getApp().globalData.gUserInfo.userInfo}
		userInfo.avatarUrl = userInfo.avatarUrl || "/static/icon/logo.png"
		return {
			userInfo,
			/* 标签 */
			tags: ["前端","挑战杯","商业计划书","运河杯","服务外包"],
			/* 任务列表 */
			tasks: [
				{name: "进行中",icon: "icon-shouye",to: "/pages/Self/AccountInfo"},
				{name: "已完成",icon: "icon-yiwancheng",to: "/pages/Self/AccountInfo"},
				{name: "贡献详情",icon: "icon-icon",to: "/pages/Resource/MyResources"},
			],
			/* 功能列表 */
			funtions: [
				{name: "贡献值",icon: "icon-icon;",val: "160",to:""},
				{name: "实名认证",icon: "icon-shimingrenzheng",to:"/pages/Self/AccountInfo"},
				{name: "个人简历",icon: "icon-personal",to:"/pages/Self/Resume"},
				{name: "邀请好友",icon: "icon-iconfontzhizuobiaozhun49",to:"/pages/Self/AccountInfo"},
				{name: "联系管理员",icon: "icon-lianxikefu",to:"/pages/Self/AccountInfo"},
			],
			isCheckTags: false, // 是否进入选择标签
		}
	},
	methods: {
		/* 
			name: 设置昵称
			description: 失去焦点时修改账号的昵称，需要预先判断是否有修改，即对比原数据与新输入的内容是否相等
		*/
		setNickName(e)
		{
			const value = e.detail.value
			/* 判断value与原本的nickName是否相同，相同则无需请求，不同则请求服务器修改nickName */
			if(value !== this.userInfo.nickname)
			{
				putMe({
					nickname: value
				})
				.then(res => {
					this.userInfo = this.gPutUserInfo({nickname: value}).userInfo
					this.gToastSuccess("修改昵称成功!")
				})
			}
		},
		/*
			name: 点击头像
			description: 点击头像打开操作菜单，可选择预览或者修改头像
									 点击预览，触发预览效果
									 点击修改头像，进入选择头像模式，选择完成后上传头像至oss，然后将链接存储到数据库中。
		*/
		clickAvatar()
		{
			/* 进入操作菜单 */
			uni.showActionSheet({
				itemList: ['预览头像', '修改头像'],
				success:  (res) => {
					/* 预览头像 */
					if(res.tapIndex === 0)
					{
						uni.previewImage({
							urls: [this.userInfo.avatarUrl]
						})
					}
					/* 修改头像 */
					else if(res.tapIndex === 1)
					{
						uni.chooseImage({
							count: 1, //默认9
							sizeType: ['compressed'],
							success:  (img) => {
								/* 压缩图片 */
								uni.compressImage({
								  src: img.tempFilePaths[0],
								  quality: 50,
								  success: res => {
										/* 获取签名 */
										getAvatarOssSignature()
										.then(sign => {
											uni.showLoading({
												title: "上传头像中..."
											})
											/* 上传文件 */
											this.gUploadFile(res.tempFilePath,"avatar.JPG",sign.data)
											.then(upRes => {
												/* 更新头像 */
												putMe({
													avatarUrl: upRes.url
												})
												.then(putRes => {
													this.userInfo = this.gPutUserInfo({avatarUrl: upRes.url}).userInfo,
													uni.hideLoading()
													this.gToastSuccess("修改头像成功!")
												})
											})
										})
								  }
								})
							}
						})
					}
				},
				fail: function (res) {
					console.log(res.errMsg);
				}
			})
		},
	},
	created() {
		
	}
}
</script>

<style lang="stylus" scoped>
bgSetting(size,color)
	width size
	height size
	background-color color
.self
	min-height 100vh
	width 100%
	padding-bottom 140rpx
	background-color var(--origin2)
	/* 头部 */
	.head
		position relative
		height 45vw
		background-color #FFFFFF
		/* 头像 */
		.avatar
			position absolute
			width 60vw
			height 60vw
			left 20vw
			top 20vw
			transform translate(-50%,-50%)
			display flex
			align-items center
			justify-content center
			image
				z-index 5
				width 30vw
				height 30vw
				border-radius 50%
			.bg
				position absolute
				border-radius 50%
			.bg1
				bgSetting(40vw,var(--origin2))
			.bg2
				bgSetting(50vw,var(--origin3))
			.bg3
				bgSetting(60vw,var(--origin4))
		/* 右侧 */
		.right
			margin-left 50vw
			width 50vw
			padding 10px
			.name
				color var(--origin4)
				font-weight 600
				border-bottom 1px solid rgba(144,140,139,0.65)
			.tags
				display flex
				flex-wrap wrap
				.tag
					margin 5px
					padding 3px 10px
					border-radius 10px
					background-color var(--origin3)
		/* 幕布 */
		.curtain
			position absolute
			top 0
			width 100%
			height 70vw
			display flex
			animation 1ms closeCurtain forwards
			animation-delay .8s
			view
				width 50%
			.one
				background-color var(--origin2)
				transform-origin right top
				animation curtain1 .8s forwards
			.two
				background-color var(--origin2)
				transform-origin left top
				animation curtain2 .8s forwards
				
	/* 核心导航 招募队友 & 资源分享 */
	.navs
		margin 10vw 0 20px
		display flex
		justify-content space-around
		navigator
			width 35%
			padding 10px 0
			text-align center
			background-color var(--origin4)
			color #FFFFFF
			border-radius 30px
			font-weight 600
	/* 任务列表 */
	.tasks
		margin 0 auto
		width 90%
		padding 5px
		background-color #FFFFFF
		border-radius 20px
		display flex
		justify-content space-around
		.task
			text-align center
			text
				font-size 70rpx
				color var(--origin3)
			view
				color var(--origin4)
				font-weight 600
	/* 功能列表 */
	.list
		margin 10px auto
		width 90%
		.item
			margin-bottom 3px
			transform translateY(50vh)
			padding 10px 20px
			background-color #FFFFFF
			display flex
			align-items center
			animation funShow .3s forwards
			&:first-child
				border-top-left-radius 20px
				border-top-right-radius 20px
			&:last-child
				border-bottom-left-radius 20px
				border-bottom-right-radius 20px
			.iconfont
				font-size 50rpx
				color var(--origin4)
			.right
				font-size 60rpx
			.name
				margin-left 25rpx
				flex 1
				color var(--origin3)
				font-weight 800
			.val
				font-size 30rpx
				color var(--gray-font)
/* 动画 */
@keyframes curtain1
	to
		transform rotate(90deg)
@keyframes curtain2
	to
		transform rotate(-90deg)
/* 隐藏幕布 */
@keyframes closeCurtain
	to
		z-index -1
@keyframes funShow
	to
		transform translateY(0)
</style>
