<template>
	<view class="self">
		<!-- 头部 -->
		<view class="head">
			<!-- 头像 -->
			<view class="avatar" @click="clickAvatar">
				<view class="bg bg3"></view>
				<view class="bg bg2"></view>
				<view class="bg bg1"></view>
				<image :src="userInfo.avatarUrl || 'https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png'"></image>
			</view>
			<!-- 右侧昵称 & 标签 -->
			<view class="right">
				<!-- 昵称 -->
				<input class="name" :value="userInfo.nickname" maxlength="15" @blur="setNickName" />
				<!-- 标签 -->
				<view class="tags" @click="isCheckTags = true">
					<view class="tag" v-for="(tag, index) in tags" :key="index">{{ tag }}</view>
				</view>
			</view>
			<!-- 幕布 -->
			<view class="curtain" ref="curtain">
				<view class="one"></view>
				<view class="two"></view>
			</view>
		</view>
		<!-- 我的项目 & 外包管理 & 招募队友 -->
		<view class="navs">
			<navigator hover-class="hoverScale" hover-stay-time="50" url="/pages/Project/Projects">我的项目</navigator>
			<navigator hover-class="hoverScale" hover-stay-time="50" url="/pages/Epiboly/MyEpiboly">外包管理</navigator>
			<navigator hover-class="hoverScale" hover-stay-time="50" url="/pages/Project/Projects">招募队友</navigator>
		</view>
		<!-- 任务 进行中 & 已完成 & 贡献详情 -->
		<view class="tasks">
			<navigator class="task" v-for="(task, index) in tasks" :key="index" hover-class="none" :url="task.to">
				<text :class="'iconfont ' + task.icon"></text>
				<view>{{ task.name }}</view>
			</navigator>
		</view>
		<!-- 功能列表 -->
		<view class="list">
			<navigator
				class="item"
				:style="{
					animationDelay: index * 0.1 + 's'
				}"
				v-for="(item, index) in funtions1"
				:key="index"
				hover-stay-time="50"
				:url="item.to">
				<text :class="'iconfont ' + item.icon"></text>
				<text class="name small">{{ item.name }}</text>
				<text v-if="item.val >= 0" class="small val">{{ item.val }}</text>
				<text v-else class="right iconfont icon-arrow-right"></text>
			</navigator>
		</view>
		<view class="list">
			<navigator
				class="item"
				:style="{
					animationDelay: (index+funtions1.length) * 0.1 + 's'
				}"
				v-for="(item, index) in funtions2"
				:key="index"
				hover-stay-time="50"
				:url="item.to">
				<text :class="'iconfont ' + item.icon"></text>
				<text class="name small">{{ item.name }}</text>
				<text class="right iconfont icon-arrow-right"></text>
			</navigator>
		</view>
		<!-- 兴趣选择 -->
		<SelectInterest v-if="isCheckTags" @close="isCheckTags = false"></SelectInterest>
		<!-- 登出 -->
		<button style="width: 90%;margin: auto;background-color: #e86452;" @click="out">退出登录</button>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getAvatarOssSignature, putMe, getUnreadCount } from '@/static/request/api_userInfo.js';
import { loginOut } from '@/static/request/api_login.js';
export default {
	data() {
		return {
			userInfo: { ...getApp().globalData.gUserInfo.userInfo },
			/* 任务列表 */
			tasks: [
				{ name: '已购项目', icon: 'icon-shouye', to: '/pages/Project/PurchasedProjects' },
				{ name: '已完成', icon: 'icon-yiwancheng', to: '/pages/Self/Authentication' },
				{ name: '贡献详情', icon: 'icon-icon', to: '/pages/Project/Project' }
			],
			/* 功能列表 */
			funtions1: [
				{ name: 'userId', icon: 'icon-ID', to: '', val: getApp().globalData.gUserInfo.userInfo.userId },
				{ name: '贡献值', icon: 'icon-icon', to: '/pages/Self/Orders', val: getApp().globalData.gUserInfo.contribPoint },
				{ name: '消息通知', icon: 'icon-tongzhi1', to: '/pages/Self/Informs', val: 10 },
				{ name: '账号信息', icon: 'icon-zhanghao', to: '/pages/Self/NumberInfo' },
				{ name: '邀请好友', icon: 'icon-iconfontzhizuobiaozhun49', to: '/pages/Self/InviteMember'},
			],
			funtions2: [
				{ name: '我的收藏', icon: 'icon-shoucang', to: '/pages/Self/MyCollection'},
				{ name: '个人简历', icon: 'icon-jianli', to: '/pages/Self/Resume'},
				{ name: '意见反馈', icon: 'icon-lianxikefu', to: '/pages/Self/Feedback'},
				{ name: '联系客服', icon: 'icon-lianxikefu', to: '/pages/Self/Feedback'},
			],
			isCheckTags: false // 是否进入选择标签
		};
	},
	computed: {
		tags() {
			let isCheckTags = this.isCheckTags // 检测标签更改
			const userInfo = getApp().globalData.gUserInfo.userInfo
			let specialtyTags = []
			let compTags = []
			if (userInfo.specialtyTags){
				specialtyTags = userInfo.specialtyTags.split(',')
			} 
			if (userInfo.compTags){
				compTags = userInfo.compTags.split(',')
			} 
			let res = specialtyTags.concat(compTags)
			if (res.length === 0){
				res = ['点击定制个人标签']
			} 
			return res
		}
	},
	methods: {
		/* 
			name: 设置昵称
			description: 失去焦点时修改账号的昵称，需要预先判断是否有修改，即对比原数据与新输入的内容是否相等
		*/
		setNickName(e) {
			const value = e.detail.value
			/* 判断value与原本的nickName是否相同，相同则无需请求，不同则请求服务器修改nickName */
			if (value !== this.userInfo.nickname) {
				putMe({
					nickname: value
				}).then(res => {
					this.userInfo = this.gPutUserInfo({ nickname: value }).userInfo
					this.gToastSuccess('修改昵称成功!')
				})
			}
		},
		/*
			name: 点击头像
			description: 点击头像打开操作菜单，可选择预览或者修改头像点击预览，触发预览效果点击修改头像，进入选择头像模式，选择完成后上传头像至oss，然后将链接存储到数据库中。
            time: 2020/11/15
		*/
		clickAvatar() {
			/* 进入操作菜单 */
			uni.showActionSheet({
				itemList: ['预览头像', '修改头像', '查看个人信息'],
				success: (res) => {
					/* 预览头像 */
					if (res.tapIndex === 0) {
						uni.previewImage({
							urls: [this.userInfo.avatarUrl]
						});
					} 
					else if (res.tapIndex === 1) {
						/* 修改头像 */
						uni.chooseImage({
							count: 1, //默认9
							sizeType: ['compressed'],
							success: img => {
								/* 压缩图片 */
								uni.compressImage({
									src: img.tempFilePaths[0],
									quality: 50,
									success: res => {
										this.gLoading(this, true);
										/* 获取签名 */
										getAvatarOssSignature()
										.then(sign => {
											/* 上传文件 */
											this.gUploadFile(res.tempFilePath, `${Date.now()}.JPG`, sign.data).then(upRes => {
												/* 更新头像 */
												putMe({
													avatarUrl: upRes
												})
												.then(putRes => {
													this.userInfo = this.gPutUserInfo({ avatarUrl: upRes }).userInfo;
													this.gToastSuccess('修改头像成功!')
													this.gLoading(this, false)
												})
												.catch(err => {
													this.gLoading(this, false)
												})
											})
										})
										.catch(err => {
											this.gLoading(this, false)
										})
									}
								})
							}
						})
					} 
					else if (res.tapIndex === 2) {
						uni.navigateTo({
							url: 'Self/UserHome?userId=' + this.userInfo.userId
						})
					}
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});
		},
		/* 退出登录，调用modal确认*/
		out() {
			this.gShowModal('确认退出登录?', () => {
				loginOut();
				uni.clearStorageSync('token');
				uni.reLaunch({
					url: 'Login/Login',
					success: () => {
						this.gToastSuccess('已退出登录');
					}
				});
			});
		}
	},
	created() {
		getUnreadCount()
		.then(res => {
			this.funtions1[2].val = res.data
		})
	}
};
</script>

<style lang="stylus" scoped>
bgSetting(size, color)
	width size
	height size
	background-color color
.self
	min-height 100vh
	width 100%
	padding-bottom 150rpx
	background-color var(--white1)
	/* 头部 */
	.head
		position relative
		height 45vw
		background-color var(--origin3)
		/* 头像 */
		.avatar
			position absolute
			width 60vw
			height 60vw
			left 20vw
			top 20vw
			transform translate(-50%, -50%)
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
				bgSetting(40vw, var(--origin4))
			.bg2
				bgSetting(50vw, var(--origin3))
			.bg3
				bgSetting(60vw, var(--origin2))
		/* 右侧 */
		.right
			margin-left 52vw
			width 50vw
			padding 10px 0
			.name
				color var(--origin1)
				font-weight 600
				font-size 38rpx
				border-bottom 2px solid var(--origin2)
				border-radius 0
			.tags
				display flex
				flex-wrap wrap
				.tag
					margin 3px
					padding 0 5px
					border-radius 10px
					background-color var(--origin1)
					color #FFFFFF
					font-size 22rpx
		/* 幕布 */
		.curtain
			position absolute
			top 0
			width 100%
			height 70vw
			display flex
			animation 1ms closeCurtain forwards
			animation-delay 0.8s
			view
				width 50%
			.one
				background-color var(--origin2)
				transform-origin right top
				animation curtain1 0.5s forwards
			.two
				background-color var(--origin2)
				transform-origin left top
				animation curtain2 0.5s forwards
	/* 核心导航 招募队友 & 资源分享 */
	.navs
		margin 10vw 0 20px
		display flex
		justify-content center
		navigator
			margin 0 5px
			width 28%
			padding 10px 0
			text-align center
			background-color var(--origin2)
			box-shadow 4px 4px 1px var(--origin1)
			color #FFFFFF
			font-weight 600
			&:nth-of-type(1)
				border-top-left-radius 22px
				border-bottom-left-radius 22px
				border-top-right-radius 10px
				border-bottom-right-radius 10px
			&:nth-of-type(2)
				border-radius 10px
			&:nth-of-type(3)
				border-top-left-radius 10px
				border-bottom-left-radius 10px
				border-top-right-radius 22px
				border-bottom-right-radius 22px
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
			font-size 24rpx
			color var(--origin1)
			.iconfont
				line-height 1.2
				font-size 54rpx
				color var(--origin2)
	/* 功能列表 */
	.list
		margin 10px auto
		width 90%
		.item
			margin-bottom 1px
			transform translateY(50vh)
			opacity 0
			padding 5px 20px
			background-color #FFFFFF
			display flex
			align-items center
			animation funShow 0.1s ease-out forwards
			&:first-child
				border-top-left-radius 20px
				border-top-right-radius 20px
			&:last-child
				border-bottom-left-radius 20px
				border-bottom-right-radius 20px
			.iconfont
				font-size 40rpx
				color var(--origin2)
			.right
				font-size 50rpx
			.name
				margin-left 25rpx
				flex 1
				color var(--gray1)
			.val
				color var(--origin2)
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
		opacity 1
</style>
