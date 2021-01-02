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
						v-for="(tag,index) in arr_tags"
						:key="index">
						{{tag}}
					</view>
				</view>
			</view>
		</view>
		<view id="content2" class="content" style="margin-top: 15px;">
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
				</view>
				<view class="small">非媒体类附件将从外部应用打开,请通过外部应用保存至本地.</view>
				<view class="list">
					<!-- 已购买 -->
					<view v-if="arr_purchasedFiles.length > 0">
						<view class="val">已购买</view>
						<view class="file"
							v-for="(file, index) in arr_purchasedFiles" 
							:key="index">
							<view class="name" @click="readFile(file,index)">{{ file.name }}</view>
						</view>
					</view>
					<!-- 可预览 -->
					<view v-if="arr_previewFiles.length > 0">
						<view class="val">可预览</view>
						<view class="file"
							v-for="(file, index) in arr_previewFiles" 
							:key="index">
							<view class="name" @click="preview(file)">{{ file.name }}</view>
							<button v-if="!file.isBuy" @click="buyFile(file)">{{file.price}}Aha点购买</button>
						</view>
					</view>
					<!-- 不可预览 -->
					<view v-if="arr_unpreviewFiles.length > 0">
						<view class="val">不可预览</view>
						<view class="file" 
							v-for="(file, index) in arr_unpreviewFiles" 
							:key="index">
							<view class="name">{{ file.name }}242424</view>
							<button v-if="!file.isBuy" @click="buyFile(file)">{{file.price}}Aha点购买</button>
						</view>
					</view>
					
				</view>
			</view>
			<!-- 项目评价 -->
			<view class="item">
				<view class="title" id="comments">项目评论</view>
				<view v-if="comments.length===0" class="center nocomment">暂无评论</view>
				<view 
					v-else
					class="comment"
					v-for="(comment,index) in comments"
					:key="index">
					<image :src="comment.user.avatarUrl"></image>
					<view class="right">
						<view class="head">
							<view class="name">{{comment.user.nickname}}</view>
							<view class="blank"></view>
							<view class="score"><text class="iconfont icon-start"></text>{{comment.score}}</view>
							<view class="time">{{comment.time}}</view>
						</view>
						<view class="container">
							{{comment.comment}}
						</view>
						<view class="file-control">
							<text class="filename">{{comment.filename}}</text>
							<text v-if="comment.isMe" class="iconfont icon-remove" @click="removeComment(comment,index)"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 写评论模块 -->
		<WriteRemark
			v-if="id"
			:projectId="id"
			:files="resources"
			@scrollComment="scrollComment"
			@collectChange="collect+=$event"
			@success="getCommentsInfo(true)">
		</WriteRemark>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getProject, getLoadSignature,getRemarks,deleteRemark } from '@/static/request/api_project.js'
import { postOrder,putOrder,checkResourcePurchased } from "../../static/request/api_order.js"
import WriteRemark from "./components/WriteRemark.vue"
export default {
	data() {
		return {
			id: null,
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
			resources: [],
			arr_purchasedFiles: [],
			arr_previewFiles: [],
			arr_unpreviewFiles: [],
			comments: [],
			/* 分页获取评论信息 */
			pageNum: 1,
			pageSize: 5,
			is_showAllComments: false
		}
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
		arr_tags() {
			if (this.tags){
				return this.tags.split(" ")
			}
			return ''
		}
	},
	onLoad(e) {
		this.gLoading(this,true)
		getProject(e.id)
		.then(res => {
			console.log(res.data);
			for (let key in res.data){
				this[key] = res.data[key]
			}
			this.members = this.members.sort((a, b) => a.rank - b.rank)
			if(this.resources.length > 0){
				this.initFiles()
			}
			else{
				this.gLoading(this,false,500)
			}
		})
		.catch(err => {
			this.gLoading(this,false)
		})
	},
	components: {
		WriteRemark
	},
	onShareAppMessage(e){
		return {
			title: "Aha口袋",
			path: `pages/Project/Project?id=${this.id}`,
			desc: "Aha口袋邀您阅读" + this.name,
		}
	},
	onReachBottom(){
		if(!this.is_showAllComments){
			this.getCommentsInfo()
		}
	},
	methods: {
		/* 初始化附件 */
		initFiles()
		{
			checkResourcePurchased(this.id)
			.then(res => {
				this.resources.forEach(file => {
					file.isBuy = res.data.indexOf(file.id) > -1 ? true : false
					if(file.isBuy){
						this.arr_purchasedFiles.push(file)
					}
					else if(file.previewUrl){
						this.arr_purchasedFiles.push(file)
						// this.arr_previewFiles.push(file)
					}
					else{
						this.arr_purchasedFiles.push(file)
						// this.arr_unpreviewFiles.push(file)
					}
				})
				this.gLoading(this,false)
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		},
		/* 获取评论 */
		getCommentsInfo(init=false)
		{
			if(init){
				this.pageNum = 1
			}
			const userId = getApp().globalData.gUserInfo.userInfo.userId
			getRemarks({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				projectId: this.id
			})
			.then(res => {
				if(res.data.pageData.length < this.pageSize){
					this.is_showAllComments = true
				}
				else{
					this.pageNum++
				}
				if(init){
					this.comments = []
				}
				res.data.pageData.forEach(remark => {
					const file = this.resources.find(item => item.id === remark.resourceId)
					remark.filename = file.name
					remark.isMe = userId === remark.user.userId
					remark.time = this.gformatDate(remark.time)
					this.comments.push(remark)
				})
				console.log(this.comments);
			})
		},
		/* 购买文件 */
	    buyFile(file)
		{
			this.gShowModal(`确认花费${file.price}个贡献度购买该附件？`,() => {
				postOrder({
					projectId: file.projectId,
					resourceIds: [file.id]
				})
				.then(res => {
					const orderId = res.data
					/* 调用微信支付 */
					putOrder(orderId,"pay")
					.then(res => {
						console.log(res.data);
						this.gToastSuccess("购买成功")
					})
				})
			})
		},
		/* 
			阅读项目, 先判断类型,文档类跳转预览，其他类型需要获取下载地址再进行操作
			@params file:Object,文件信息
		*/
	    readFile(file,index)
		{
			const type = getApp().globalData.arr_fileTypes.find(item => item.reg.test(file.filename)).value
			/* 文档类跳转previewFile界面 */
			if(type === 2){
				uni.navigateTo({
					url: "readFile?id=" + file.id
				})
			}
			else{
				this.gLoading(this,true)
				if(file.url){
					console.log(file.url);
					/* 图片/视频直接打开 */
					if(type === 0 || type === 1){
						wx.previewMedia({
							sources: [{
								url: file.url,
								type: file.type === 0 ? "image" : "video"
							}],
							showmenu: false,
							complete: () => {
								this.gLoading(this,false)
							}
						})
					}
					else{
						/* 其他类需要下载到本地 */
						this.gLoading(this,false)
					}
				}
				/* 没有缓存下载路径，请求签名路径后再回调该函数 */
				else {
					getLoadSignature(file.id)
					.then(res => {
						this.gGetFileUrl(res.data)
						.then(url => {
							this.arr_purchasedFiles[index].url = url
							this.readFile(this.arr_purchasedFiles[index],index)
							this.gLoading(this,false)
						})
						.catch(err => {
							console.error(err)
							this.gLoading(this,false)
						})
					})
					.catch(err => {
						console.error(err)
						this.gLoading(this,false)
					})
				}
			}
		},
		/* 
			预览项目，先判断类型,文档类跳转预览，图片/视频直接打开
			@params file:Object,文件信息
		*/
		preview(file) 
		{
			const type = getApp().globalData.arr_fileTypes.find(item => item.reg.test(file.filename)).value
			/* 文档类跳转previewFile界面 */
			if(type === 2){
				const urls = []
				for(let i=1;i<=5;i++){
					const url = `${file.previewUrl}${i}.jpg`
					urls.push({url})
				}
				wx.previewMedia({
					sources: urls
				})
			}
			return
			if(reg.test(file.filename)){
				this.previewImg(file)
			} 
			/* 文档类：下载后打开 */ 
			else {
				this.gLoading(this,true)
				if (file.previewLoad) {
					uni.openDocument({
						filePath: file.previewUrl,
						complete() {
							this.gLoading(this,false)
						}
					})
				} 
				else {
					uni.downloadFile({
						url: file.previewUrl,
						success: res => {
							this.arr_previewFiles[index].previewUrl = res.tempFilePath
							this.arr_previewFiles[index].previewLoad = true
							uni.openDocument({
								filePath: res.tempFilePath,
								complete: () => {
									this.gLoading(this,false)
								}
							})
							console.log(res)
						},
						fail: err => {
							console.log(err)
							this.gLoading(this,false)
						}
					})
				}
			}
		},
		/* 滚动到评论区 */
		scrollComment()
		{
			uni.createSelectorQuery().select("#comments").boundingClientRect(data=>{//目标节点
			　　uni.createSelectorQuery().select("#content2").boundingClientRect((res)=>{//最外层盒子节点
					uni.pageScrollTo({
						duration:0,
						scrollTop: data.top - res.top,//滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
					})
			　　}).exec()
			}).exec()
		},
		/* 删除评论 */
		removeComment(comment,index)
		{
			this.gShowModal("您确定删除该评价?",() => {
				deleteRemark(comment.resourceId)
				this.comments.splice(index,1)
				this.gToastSuccess("删除成功")
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.project
	padding 10px 10px 50px
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
				image
					width 100%
					height 100%
					border-radius 8px
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
					font-size 26rpx
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
						width 100%
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
					width 100%
					font-size 26rpx
					display flex
					align-items center
					.name
						flex 1
						text-decoration underline
						font-size 24rpx
						color var(--origin1)
						word-break break-all
					button
						margin 0
						white-space nowrap
						padding 5px
						border-radius 22px
						font-size 22rpx
						font-weight 400
						line-height 1
						text-align center
		.comment
			margin 5px 0
			padding 10px 10px 0 10px
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
				.head
					display flex
					align-items center
					.name
						padding 0 10px
						border-radius 22px
						background-color var(--origin2)
						color #FFFFFF
						font-size 24rpx
					.score
						font-size 22rpx
						color var(--origin2)
						.iconfont
							font-size 22rpx
					.time
						margin-left 5px
						font-size 22rpx
						color var(--gray1)
				.container
					padding 5px 0
					font-size 24rpx
				.file-control
					display flex
					align-items center
					justify-content space-between
					.filename
						color var(--gray2)
						font-size 22rpx
					.iconfont
						color var(--origin1)
		.nocomment
			font-size 20rpx
			margin-top 5px
			color var(--gray2)
</style>
