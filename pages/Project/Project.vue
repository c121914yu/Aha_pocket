<template>
	<view class="project">
		<view class="content">
			<!-- 头像 & 首作者 & 创建时间 & 收藏 & 阅读-->
			<view class="head">
				<image :src="avatarUrl || 'https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png'" mode="widthFix"></image>
				<view class="container small">
					<text class="author">{{ members[0].nickname }}</text>
					<text class="date">2020年9月1日</text>
					<!-- 数据统计 -->
					<view class="statistics">
						<!-- 阅读量 -->
						<view class="read">
							<text class="iconfont icon-readed"></text>
							<text class="val">{{ read }}</text>
						</view>
						<!-- 收藏量 -->
						<view
							class="collect"
							:style="{
								color: isCollect ? '#e86452' : 'var(--gray2)'
							}"
							@click="collected"
						>
							<text class="iconfont icon-collection"></text>
							<text class="val">{{ collect }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 项目成员 -->
			<view class="item members">
				<view class="title">项目成员</view>
				<view class="val">
					<navigator class="member" hover-class="none" v-for="(member, index) in members" :key="index" :url="'../Self/UserHome?userId=' + member.memberUser.userId">
						{{ member.memberUser.nickname }}
					</navigator>
				</view>
			</view>
			<!-- 项目题目 -->
			<view class="item name">
				<view class="title">项目题目</view>
				<view class="val h3">{{ name }}</view>
			</view>
			<!-- 获奖情况 -->
			<view v-if="compId" class="item prize">
				<view class="title">获奖情况</view>
				<view class="val">
					<view>{{ awardTime }}&emsp;{{ awardLevelMsg }}</view>
					<view>{{ compName }}</view>
				</view>
			</view>
			<!-- 标签 -->
			<view v-if="tags" class="item tags">
				<view class="title">项目标签</view>
				<view class="val">{{ tagsMsg }}</view>
			</view>
			<!-- 描述 -->
			<view v-if="intro" class="item intro">
				<view class="title">项目描述</view>
				<view class="val" v-html="intro"></view>
			</view>
			<!-- 附件 -->
			<view class="item files">
				<view class="title">
					项目附件
					<view v-if="isBuy" class="remark">已购买</view>
					<button v-else>10贡献度购买</button>
				</view>
				<view class="small">非媒体类附件将从外部应用打开，请通过外部应用保存至本地。</view>
				<view class="val">
					<view v-if="!isBuy">可预览:</view>
					<view class="file" v-for="(file, index) in previewFiles" :key="index" @click="preview(file, index)">{{ file.name }}</view>
					<view v-if="!isBuy">不可预览:</view>
					<view class="file" v-for="(file, index) in unPreviewFiles" :key="index" @click="loadFile(file, index)">{{ file.name }}</view>
				</view>
			</view>
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
			isBuy: false,
			isCollect: false
		};
	},
	computed: {
		awardLevelMsg() {
			if (this.compId) {
				let res = getApp().globalData.prizeLevels.find(item => item.value === this.awardLevel);
				if (res) return res.label;
			}
			return '';
		},
		tagsMsg() {
			if (this.tags) return this.tags.replace(/\s+/g, ',');
			return '';
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
				});
			};
			if (file.previewLoad) viewImg(file.previewUrl);
			else {
				getLoadSignature(file.id).then(res => {
					this.previewFiles[index].previewUrl = res.data.url;
					this.previewFiles[index].previewLoad = true;
					viewImg(res.data.url);
					console.log(res);
				});
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
			if (reg.test(file.name)) this.previewImg(file, index)
			/* 文档类：下载后打开 */ else {
				uni.showLoading({
					title: '打开中...'
				})
				if (file.previewLoad) {
					uni.openDocument({
						filePath: file.previewUrl,
						complete() {
							uni.hideLoading()
						}
					});
				} else {
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
				});
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
					});
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
	padding 10px
	min-height 100vh
	background-color var(--white1)
	.content
		padding 10px
		border-radius 8px
		background-color #FFFFFF
		/* 头像 & 首作者 & 创建时间 & 收藏 & 阅读 */
		.head
			display flex
			image
				width 80px
				height 80px
				border-radius 8px
			.container
				padding 0 10px
				display flex
				flex-direction column
				justify-content space-between
				.date
					font-size 22rpx
					color var(--gray1)
				.statistics
					display flex
					view
						margin-right 10px
						font-size 24rpx
						line-height 1
						display flex
						align-items center
					.iconfont
						margin-right 2px
					.read
						color #5d7092
		/* 各类数据共同样式 */
		.item
			margin 15px 0
			/* 引导标题 */
			.title
				margin-bottom 5px
				padding-left 5px
				position relative
				color var(--origin2)
				line-height 1
				border-left 3px solid var(--origin2)
				border-radius 2px
				display flex
				align-items center
			.val
				padding 5px
		/* 成员数据 */
		.members
			.member
				margin-right 10px
				text-decoration underline
				color var(--origin1)
		/* 附近 */
		.files
			button
				position absolute
				margin-left 80px
				padding 5px
				line-height 1
				font-size 22rpx
				border-radius 8px
				background-color #5d7092
			.remark
				color #04BE02
				margin-left 10px
			.small
				color #e86452
			.file
				margin 10px 0
				text-decoration underline
				color var(--origin1)
</style>
