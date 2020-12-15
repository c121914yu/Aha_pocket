<template>
	<view class="project">
		<view class="content">
			<!-- 头像 & 首作者 & 创建时间 & 收藏 & 阅读-->
			<view class="head">
				<view class="left">
					<view class="h3">项目介绍</view>
					<view class="date">2020年9月1日</view>
					<!-- 数据统计 -->
					<view class="statistics">
						<!-- 阅读量 -->
						<view class="read">
							<text class="iconfont icon-readed"></text>
							<text class="val">{{ read }}</text>
						</view>
						<!-- 收藏量 -->
						<view class="collect">
							<text class="iconfont icon-collection"></text>
							<text class="val">{{ collect }}</text>
						</view>
					</view>
				</view>
				<view class="right">
					<image :src="avatarUrl || 'https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png'" mode="widthFix"></image>
				</view>
			</view>
			<!-- 项目成员 -->
			<view class="item">
				<view class="title">项目成员</view>
				<view class="values">
					<navigator 
						class="val arr" 
						hover-class="none"
						style="text-decoration: underline;"
						v-for="(member, index) in members" 
						:key="index" 
						:url="'../Self/UserHome?userId=' + member.memberUser.userId">
						{{ member.memberUser.nickname }}
					</navigator>
				</view>
			</view>
			<!-- 项目题目 -->
			<view class="item">
				<view class="title">项目题目</view>
				<view class="values"><view class="val name">{{ name }}</view></view>
			</view>
			<!-- 获奖情况 -->
			<view v-if="compId" class="item prize">
				<view class="title">获奖情况</view>
				<view class="values">
					<view class="val arr">{{ awardTime }}</view>
					<view class="val arr">{{ awardLevelMsg }}</view>
					<view class="val arr">{{ compName }}</view>
				</view>
			</view>
			<!-- 标签 -->
			<view v-if="tags" class="item tags">
				<view class="title">项目标签</view>
				<view class="values">
					<view
						class="val arr"
						v-for="(tag,index) in tagsMsg"
						:key="index">
						{{tag}}
					</view>
				</view>
			</view>
		</view>
		<view class="content" style="margin-top: 15px;">
			<view class="h3" style="color: var(--gray1);">项目详细</view>
			<!-- 描述 -->
			<view v-if="intro" class="item intro">
				<view class="title">项目描述</view>
				<view class="values"><view class="val desc" v-html="intro"></view></view>
			</view>
			<!-- 附件 -->
			<view class="item files">
				<view class="title">
					项目附件
					<view v-if="isBuy" class="remark">已购买</view>
					<button class="all-buy" v-else>10贡献度购买</button>
				</view>
				<view class="small">非媒体类附件将从外部应用打开,请通过外部应用保存至本地.</view>
				<view class="list">
					<view class="val" v-if="!isBuy">可预览</view>
					<view class="file"
						v-for="(file, index) in previewFiles" 
						:key="index">
						<view class="name" @click="preview(file, index)">{{ file.name }}</view>
						<button>5贡献度购买</button>
					</view>
					<view class="val" v-if="!isBuy">不可预览</view>
					<view class="file" 
						v-for="(file, index) in unPreviewFiles" 
						:key="index">
						<view class="name" @click="loadFile(file, index)">{{ file.name }}242424</view>
						<button>5贡献度购买</button>
					</view>
				</view>
			</view>
			<!-- 项目评价 -->
			<view class="item">
				<view class="title">项目评论</view>
				<view 
					class="remark"
					v-for="(remark,index) in remarks"
					:key="index">
					<image :src="remark.avatarUrl"></image>
					<view class="right">
						<view class="head">
							<view class="name">{{remark.name}}</view>
							<view class="time">{{remark.time}}</view>
						</view>
						<view class="container">
							{{remark.content}}
						</view>
						<view class="reply">
							
							<button>回复</button>
						</view>
					</view>
				</view>
				<view class="load-msg center small">已加载全部</view>
			</view>
		</view>
		<!-- 写评论模块 -->
		<view class="remark-hint">
			<view class="input"><text class="iconfont icon-write"></text>写下你的评论...</view>
			<text class="icon iconfont icon-xinxi"></text>
			<text v-if="isCollect" class="icon iconfont icon-collection collected" @click="collected"></text>
			<text v-else class="icon iconfont icon-shoucang" @click="collected"></text>
			<text class="icon iconfont icon-share"></text>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getProject, buyProject, isCollected, collectProject, cancleCollectProject, getLoadSignature } from '@/static/request/api_project.js';
export default {
	data() {
		return {
			name: '',
			avatarUrl: '',
			tags: '',
			intro: '',
			read: 0,
			collect: 0,
			compId: 0,
			compName: '',
			awardLevel: '',
			awardTime: '',
			members: [],
			previewFiles: [],
			unPreviewFiles: [],
			remarks: [
				{avatarUrl:"https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png",name:"余金隆",time:"2020/9/5 11:14",content:"大哥大哥大的三个和尚大哥大哥大的三个和尚阿萨德大哥大哥大的三个和尚阿萨德"},
				{avatarUrl:"https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png",name:"余金隆",time:"2020/9/5 11:14",content:"大哥大哥大的三个和尚"},
				{avatarUrl:"https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png",name:"余金隆",time:"2020/9/5 11:14",content:"大哥大哥大的三个和尚阿萨德大哥大哥大的三个和尚阿萨德大哥大哥大的三个和尚阿萨德"},
			],
			isBuy: false,
			isCollect: false
		};
	},
	computed: {
		awardLevelMsg() {
			if (this.compId) {
				let res = getApp().globalData.prizeLevels.find(item => item.value === this.awardLevel);
				if (res){
					return res.label;
				} 
			}
			return '';
		},
		tagsMsg() {
			if (this.tags){
				return this.tags.split(" ")
			} 
			return ''
		}
	},
	methods: {
		/*
			name: 收藏/取消收藏项目
			desc：根据当前收藏状态判断，收藏项目还是取消收藏，修改收藏状态及项目收藏数量
		*/
		collected() {
			/* 本是收藏的，取消收藏 */
			if (this.isCollect) {
				cancleCollectProject(this.id);
				this.collect -= 1;
			} else {
			/* 本事未收藏的收藏 */
				collectProject(this.id);
				this.collect += 1;
				uni.vibrateShort(); // 短暂震动
			}
			this.isCollect = !this.isCollect;
		},
		/* 打开图片 */
		previewImg(file, index) {
			const viewImg = url => {
				uni.previewImage({
					urls: [url]
				})
			}
			if (file.previewLoad){
				viewImg(file.previewUrl)
			} 
			else {
				getLoadSignature(file.id).then(res => {
					this.previewFiles[index].previewUrl = res.data.url
					this.previewFiles[index].previewLoad = true
					viewImg(res.data.url)
					console.log(res)
				})
			}
		},
		/* 
			name: 预览项目
			desc: 判断是否已经购买，如果已经购买触发下载
		*/
		preview(file, index) {
			if (this.isBuy) {
				this.loadFile(file, index);
				return;
			}
			/* 图片：获取预览连接后打开图片 */
			const reg = /\.(gif|jpg|jpeg|png)$/i;
			if (reg.test(file.name)){
				this.previewImg(file, index)
			} 
			/* 文档类：下载后打开 */ 
			else {
				uni.showLoading({
					title: '打开中...'
				})
				if (file.previewLoad) {
					uni.openDocument({
						filePath: file.previewUrl,
						complete() {
							uni.hideLoading()
						}
					})
				} 
				else {
					uni.downloadFile({
						url: file.previewUrl,
						success: res => {
							this.previewFiles[index].previewUrl = res.tempFilePath
							this.previewFiles[index].previewLoad = true
							uni.openDocument({
								filePath: res.tempFilePath,
								complete() {
									uni.hideLoading()
								}
							})
							console.log(res)
						},
						fail: err => {
							console.log(err)
							uni.hideLoading()
						}
					})
				}
			}
		},
		/* 
			name: 下载附件
			desc: 下载附件并打开,如果是视频则跳转播放页
		*/
		loadFile(file, index) {
			if (!this.isBuy) {
				this.gToastError('无权下载')
				return;
			}
			const imgReg = /\.(gif|jpg|jpeg|png)$/i
			const videoReg = /\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb)$/i
			/* 图片格式：直接打开 */
			if (imgReg.test(file.name)) {
				this.previewImg(file, index)
			} 
			/* 视频类型 */
			else if (videoReg.test(file.name)) {
				console.log('视频')
			} 
			/* 其他类型：下载后打开 */
			else {
				uni.showLoading({
					title: '下载中...'
				})
				if (file.loadUrl) {
					uni.openDocument({
						filePath: file.loadUrl,
						complete() {
							uni.hideLoading()
						}
					})
				} 
				else {
					getLoadSignature(file.id)
					.then(res => {
						uni.showLoading({
							title: '下载中...'
						});
						/* 保存到本地 */
						uni.downloadFile({
							url: res.data.url,
							success: res => {
								file.loadUrl = res.tempFilePath
								uni.openDocument({
									filePath: file.loadUrl,
									complete() {
										uni.hideLoading()
									}
								})
							},
							fail: err => {
								console.log(err)
								uni.hideLoading()
							}
						})
					})
				}
			}
		}
	},
	onLoad(e) {
		this.gLoading(this,true)
		getProject(e.id)
		.then(res => {
			for (let key in res.data){
				this[key] = res.data[key]
			}
			this.members = this.members.sort((a, b) => a.rank - b.rank)
			/* 将resource分类 */
			res.data.resources.forEach(file => {
				/* 图片 & 含预览路径的文件分一类 */
				const reg = /\.(gif|jpg|jpeg|png)$/i
				if (reg.test(file.name) || file.previewUrl) this.previewFiles.push(file)
				else this.unPreviewFiles.push(file)
			})
			console.log(res.data)
			this.gLoading(this,false)
		})
		.catch(err => {
			this.gLoading(this,false)
		})
		/* 判断是否收藏 */
		isCollected(e.id)
		.then(res => {
			this.isCollect = res.data
		})
	}
}
</script>

<style lang="stylus" scoped>
.project
	padding 10px 10px 40px
	min-height 100vh
	background-color var(--white1)
	.content
		padding 20px 30px
		border-radius 22px
		background-color #FFFFFF
		/* 头像 & 首作者 & 创建时间 & 收藏 & 阅读 */
		.head
			display flex
			.left
				padding 0 10px
				flex 1
				display flex
				flex-direction column
				.h3
					flex 1
				.date
					font-size 22rpx
					color var(--gray1)
				.statistics
					margin-top 5px
					display flex
					view
						margin-right 25px
						font-size 22rpx
						line-height 1
						display flex
						align-items center
						
					.iconfont
						margin-right 2px
					.read
						color var(--origin2)
					.collect
						color #e86452
			.right
				width 80px
				height 80px
				border-radius 8px
				overflow hidden
				image
					width 100%
					height 100%
		/* 各类数据共同样式 */
		.item
			margin 10px 0
			/* 引导标题 */
			.title
				margin-bottom 5px
				padding-left 5px
				position relative
				color var(--origin1)
				line-height 1
				border-left 3px solid var(--origin1)
				font-weight 700
				display flex
				align-items center
			.values
				padding 5px 0
				display flex
				flex-wrap wrap
				.val
					padding 0 20px
					border-radius 22px
					background-color var(--origin4)
					color var(--gray1)
					font-weight 24rpx
					/* 标题 */
					&.name
						min-width 50%
						font-weight 700
						text-align center
						color var(--black)
					/* 数组格式 */
					&.arr
						margin 0 5px 5px 0
					/* 描述 */
					&.desc
						border-radius 8px
						padding 0 5px
		/* 附件 */
		.files
			.all-buy
				position absolute
				margin-left 80px
				padding 5px
				line-height 1
				font-size 22rpx
				border-radius 22px
				background-color var(--origin2)
				font-weight 400
			.remark
				color #04BE02
				margin-left 10px
			.small
				color var(--origin2)
				font-size 20rpx
			.list
				.val
					margin 10px 0
					padding 0 20px
					border-radius 22px
					background-color var(--origin4)
					color var(--gray1)
					font-weight 24rpx
					display inline-block
				.file
					margin-bottom 10px
					font-size 26rpx
					display flex
					align-items center
					justify-content space-between
					.name
						flex 1
						text-decoration underline
						color var(--origin1)
						word-break break-all
					button
						min-width 88px
						white-space nowrap
						padding 5px 0
						border-radius 22px
						font-size 22rpx
						font-weight 400
						line-height 1
						text-align center
		.remark
			margin 5px 0
			padding 10px
			border-radius 8px
			background-color var(--origin4)
			display flex
			image
				width 40px
				height 40px
				border-radius 50%
			.right
				flex 1
				margin-left 10px
				font-size 24rpx
				.head
					display flex
					justify-content space-between
					.name
						padding 0 10px
						border-radius 22px
						background-color var(--origin2)
						color #FFFFFF
					.time
						font-size 22rpx
						color var(--gray1)
				.container
					padding 5px
					font-size 22rpx
				.reply
					button
						width 50px
						float right
						padding 3px 10px
						line-height 1
						font-size 22rpx
						border-radius 22px
		.load-msg
			color var(--gray1)
	/* 写评论区 */
	.remark-hint
		position fixed
		bottom 0
		left 0
		right 0
		padding 10px
		border-top var(--border2)
		background-color #FFFFFF
		display flex
		align-items center
		justify-content space-between
		.input
			width 60%
			padding 5px 10px
			background-color var(--white1)
			font-size 24rpx
			border-radius 22px
			.iconfont
				margin-right 5px
		.icon
			font-size 40rpx
			&.collected
				color #e86452
</style>
