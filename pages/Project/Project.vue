<!-- 
	项目项目介绍
	author yjl
 -->
<template>
	<view id="project" class="project">
		<view class="header">
			<aha-avatar :src="avatarUrl" size="100" readed="readed"></aha-avatar>
			<view class="right">
				<!-- 项目题目 -->
				<view class="small item">
					<view class="title">项目题目</view>
					<view class="values"><view class="val name">{{ name }}</view></view>
				</view>
				<!-- 成员 & 统计量 -->
				<view class="item">
					<view class="title">项目成员</view>
					<view class="flex">
						<!-- 项目成员 -->
						<view v-if="!is_anonymous" class="values arr">
							<navigator 
								class="val" 
								hover-class="none"
								style="text-decoration: underline;"
								v-for="(member, index) in arr_members" 
								:key="index" 
								:url="'../Self/UserHome?userId=' + member.memberUser.userId">
								{{ member.memberUser.nickname }}
							</navigator>
						</view>
						<!-- 如果是匿名，认领/修改申请 -->
						<view v-else class="claim">
							<button class="small" @click="is_claimProject=true">{{applyingID > 0 ? "修改申请匿名项目材料" : "申请认领该匿名项目"}}</button>
						</view>
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
				</view>
			</view>
		</view>
		<!-- 项目情况 -->
		<view class="content">
			<view v-if="!is_passed" class="mini unpassed-hint">当前项目审核中,仅创建者可预览,附件信息将不被展示.</view>
			<!-- 获奖情况 -->
			<view v-if="compId" class="item prize">
				<view class="title">获奖情况</view>
				<view class="values arr">
					<view v-if="awardTime" class="val">{{ awardTime }}</view>
					<view v-if="awardLevel" class="val">{{ awardLevelMsg }}</view>
					<view class="val">{{ compName }}</view>
				</view>
			</view>
			<!-- 标签 -->
			<view v-if="tags" class="item tags">
				<view class="title">项目标签</view>
				<view class="values arr">
					<view
						class="val"
						v-for="(tag,index) in arr_tags"
						:key="index">
						{{tag}}
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<!-- 描述 -->
			<view class="item" @click="gReadRichText(intro,name)">
				<view class="title">项目描述</view>
				<view class="intro">
					<rich-text :nodes="intro || '无项目介绍'"></rich-text>
				</view>
			</view>
			<!-- 附件 -->
			<view class="item files">
				<view class="title">
					项目附件<text v-if="is_anonymous" class="mini">(匿名项目不可购买)</text>
				</view>
				<!-- <view class="small">非媒体类附件将从外部应用打开,请通过外部应用保存至本地.</view> -->
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
							<!-- 非匿名资源 / 未购买情况下才显示购买按键 -->
							<button 
								v-if="!file.isBuy && !is_anonymous" 
								@click="buyFile(file,'arr_previewFiles',index)">
								{{file.price}}Aha点购买
							</button>
						</view>
					</view>
					<!-- 不可预览 -->
					<view v-if="arr_unpreviewFiles.length > 0">
						<view class="val">不可预览</view>
						<view class="file" 
							v-for="(file, index) in arr_unpreviewFiles" 
							:key="index">
							<view class="name">{{ file.name }}</view>
							<!-- 非匿名资源 / 未购买情况下才显示购买按键 -->
							<button
								v-if="!file.isBuy && !is_anonymous" 
								@click="buyFile(file,'arr_previewFiles',index)">
								{{file.price}}Aha点购买
							</button>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		<!-- 评论 -->
		<view class="content">
			<view class="item">
				<view class="title" id="comments">项目评论</view>
				<view 
					class="comment"
					v-for="(comment,index) in arr_comments"
					:key="index">
					<navigator 
						hover-class="none"
						:url="'../Self/UserHome?userId=' + comment.user.userId">
						<aha-avatar :src="comment.user.avatarUrl" radius="radius" size="40"></aha-avatar>
					</navigator>
					<view class="right">
						<view class="user-info">
							<navigator 
								hover-class="none"
								:url="'../Self/UserHome?userId=' + comment.user.userId"
								class="name">
								{{comment.user.nickname}}
							</navigator>
							<view v-if="comment.score" class="score">
								<text class="iconfont icon-start"></text>
								{{comment.score}}
							</view>
							<view class="blank"></view>
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
				<view 
					v-if="arr_comments.length===0" 
					class="center remark"
					@click="$refs['Reamrk'].type = 1">
					暂无评论,点击抢楼！
				</view>
				<view v-else class="center remark">{{is_loadAllComments ? "已加载全部" : ""}}</view>
			</view>
		</view>
		<!-- 认领项目 -->
		<claim-project
			v-if="is_claimProject"
			:projectId="id"
			:applyingID="applyingID"
			@close="is_claimProject=false"
			@success="judgeApply();is_claimProject=false">
		</claim-project>
		<!-- 写评论模块 -->
		<write-remark
			v-if="id"
			ref="Reamrk"
			:projectId="id"
			:files="arr_purchasedFiles"
			@scrollComment="scrollComment"
			@collectChange="collect+=$event"
			@success="getCommentsInfo(true)">
		</write-remark>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getProject, getLoadSignature,getRemarks,deleteRemark,getApplyProject,getPublicComments,deletePublicComment } from '@/static/request/api_project.js'
import { postOrder,putOrder,checkResourcePurchased } from "../../static/request/api_order.js"
import WriteRemark from "./components/WriteRemark.vue"
import ClaimProject from "./components/ClaimProject.vue"
export default {
	components: {
		"claim-project": ClaimProject, //认领匿名项目
		"write-remark": WriteRemark, // 写评价
	},
	data() {
		return {
			/* 匿名项目认领相关 */
			is_anonymous: false,
			applyingID: 0,
			/* 项目相关 */
			id: null,
			is_passed: true,
			avatarUrl: 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png',
			name: '项目标题',
			arr_members: [],
			read: 0,
			collect: 0,
			/* 获奖相关 */
			awardLevel: '',
			awardTime: '',
			compName: '',
			compId: 0,
			tags: '', // 标签
			intro: '',
			/* 附件分类 */
			arr_resources: [],
			arr_purchasedFiles: [],
			arr_previewFiles: [],
			arr_unpreviewFiles: [],
			/* 评论 */
			arr_comments: [],
			pageNum: 1,
			pageSize: 10,
			is_loadAllComments: false, // 写评论弹窗
			is_claimProject: false, //是否显示认证弹窗
		}
	},
	computed: {
		/* 获奖等级计算 */
		awardLevelMsg() {
			if (this.compId) {
				let res = getApp().globalData.garr_prizeLevels.find(item => item.value === this.awardLevel);
				if (res){
					return res.label
				} 
			}
			return ''
		},
		arr_tags() {
			return this.tags.split(" ") || []
		}
	},
	onLoad(e) {
		this.gLoading(this,true)
		getProject(e.id)
		.then(res => {
			this.is_anonymous = res.data.isAnonymous
			this.id = res.data.id
			this.is_passed = res.data.passed
			this.avatarUrl = res.data.avatarUrl
			this.name = res.data.name
			this.arr_members = res.data.members.sort((a, b) => a.rank - b.rank)
			this.read = res.data.read
			this.collect = res.data.collect
			this.tags = res.data.tags
			this.awardLevel = res.data.awardLevel
			this.awardTime = res.data.awardTime
			this.compName = res.data.compName
			this.compId = res.data.compId
			this.intro = res.data.intro
			this.arr_resources = res.data.resources
			console.log(res.data);
			// 如果是匿名项目，判断匿名认领情况
			this.judgeApply()
			/* 附件分类 */
			if(this.arr_resources.length > 0){
				this.initFiles()
			}
		})
		.finally(() => this.gLoading(this,false))
	},
	onShareAppMessage(e){
		return {
			title: "Aha口袋",
			path: `/pages/Login/Login?path=/pages/Project/Project&paramKey=id&paramVal=${this.id}`,
			desc: "Aha口袋邀您阅读" + this.name,
		}
	},
	onReachBottom(){
		this.getCommentsInfo()
	},
	methods: {
		/**
		 * 判断是否提交过认领
		 */
		judgeApply()
		{
			// 判断是否提交过申请
			if(this.is_anonymous){
				getApplyProject(this.id)
				.then(res => {
					this.applyingID = res.data
				})
			}
		},
		/**
		 * 初始化附件,判断是否为项目成员，如果是全放在已购买里。若不是，根据已购记录判断
		 */
		initFiles()
		{
			/* 判断是否为项目成员,若为项目成员则直接添加到已购项目中 */
			const member = this.arr_members.find(item => item.memberUser.userId === getApp().globalData.gUserInfo.userInfo.userId)
			if(member){
				this.arr_purchasedFiles = this.arr_resources
			}
			else{
				checkResourcePurchased(this.id)
				.then(res => {
					this.arr_resources.forEach(file => {
						file.isBuy = res.data.indexOf(file.id) > -1 ? true : false
						if(file.isBuy){
							this.arr_purchasedFiles.push(file)
						}
						else if(file.previewUrl){
							this.arr_previewFiles.push(file)
						}
						else{
							this.arr_unpreviewFiles.push(file)
						}
					})
				})
			}
		},
		/**
		 * 加载获取评论
		 */
		getCommentsInfo(init=false)
		{
			if(init) {
				this.gLoading(this,true)
				this.is_loadAllComments = false
				this.pageNum = 1
			}
			if(this.is_loadAllComments){
				return
			}
			const userId = getApp().globalData.gUserInfo.userInfo.userId
			const params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				projectId: this.id,
				sortBy: "time"
			}
			Promise.all([getRemarks(params),getPublicComments(params)])
			.then(res => {
				const fileComments = res[0].data.pageData
				const publicComments = res[1].data.pageData
				if(init) {
					this.arr_comments = []
				}
				
				publicComments.concat(fileComments).forEach(comment => {
					if(comment.resourceId){
						const file = this.arr_resources.find(item => item.id === comment.resourceId)
						comment.filename = file.name
					}
					comment.isMe = userId === comment.user.userId
					comment.time = this.gformatDate(comment.time)
					this.arr_comments.push(comment)
				})
				/* 判断页码 */
				if(fileComments.length < this.pageSize && publicComments.length < this.pageSize){
					this.is_loadAllComments = true
				}
				else{
					this.pageNum++
				}
				console.log(this.arr_comments);
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 购买文件
		 * @param {Object} file
		 * @param {Object} key
		 * @param {Object} index
		 */
	    buyFile(file,key,index)
		{
			const ahaCredit = getApp().globalData.gUserInfo.ahaCredit
			const ahaPoint = getApp().globalData.gUserInfo.ahaPoint
			if(ahaCredit + ahaPoint < file.price){
				this.gShowModal("余额不足,是否打开钱包?",() => {
					uni.navigateTo({
						url: "../Self/Wallet/Wallet"
					})
				})
				return
			}
			this.gShowModal(`确认花费${file.price}个Aha点购买该附件？`,() => {
				postOrder({
					projectId: file.projectId,
					resourceIds: [file.id]
				})
				.then(res => {
					this[key].splice(index,1)
					this.arr_purchasedFiles.push(file)
					this.arr_previewFiles = this.arr_previewFiles.filter(item => item.id !== file.id)
					this.arr_unpreviewFiles = this.arr_unpreviewFiles.filter(item => item.id !== file.id)
					this.gToastSuccess("购买成功")
					const orderId = res.data
					/* 调用微信支付 */
					// putOrder(orderId, "pay")
					// .then(res => {
					// 	this[key].splice(index,1)
					// 	this.arr_purchasedFiles.push(file)
					// 	this.arr_previewFiles = this.arr_previewFiles.filter(item => item.id !== file.id)
					// 	this.arr_unpreviewFiles = this.arr_unpreviewFiles.filter(item => item.id !== file.id)
					// 	this.gToastSuccess("购买成功")
					// })
				})
			})
		},
	    /**
		 * 阅读项目, 先判断类型,文档类跳转预览，其他类型需要获取下载地址再进行操作
		 * @param {Object} file 文件信息
		 * @param {Object} index 文件数组下标
		 */
	    readFile(file,index)
		{
			/* 文档类跳转readFile界面 */
			if(file.fileType === 2){
				uni.navigateTo({
					url: `ReadFile?id=${file.id}` 
				})
			}
			else{
				if(file.url){
					/* 图片/视频直接打开 */
					if(file.fileType === 0 || file.fileType === 1){
						this.gLoading(this,true)
						wx.previewMedia({
							sources: [{
								url: file.url,
								type: file.fileType === 0 ? "image" : "video"
							}],
							showmenu: false,
							complete: () => {
								this.gLoading(this,false)
							}
						})
					}
					/* 其他则复制下载链接 */
					else{
						this.gClipboardData(file.url,"已复制下载链接")
					}
				}
				/* 没有缓存下载路径，请求签名路径后再回调该函数 */
				else {
					this.gLoading(this,true)
					getLoadSignature(file.id)
					.then(res => {
						this.gGetFileUrl(res.data)
						.then(url => {
							this.arr_purchasedFiles[index].url = url
							this.readFile(this.arr_purchasedFiles[index],index)
						})
					})
					.finally(() => this.gLoading(this,false))
				}
			}
		},
	    /**
		 * 预览项目，先判断类型,文档类跳转预览，图片/视频直接打开
		 * @param {Object} file 文件信息
		 */
		preview(file) 
		{
			const type = getApp().globalData.garr_fileTypes.find(item => item.reg.test(file.filename)).value
			/* 文档类跳转*/
			if(type === 2){
				uni.navigateTo({
					url: "PreviewFile?url=" + file.previewUrl
				})
			}
		},
		/**
		 * 滚动到评论区
		 */
		scrollComment()
		{
			uni.createSelectorQuery().select("#comments").boundingClientRect(data=>{//目标节点
			　　uni.createSelectorQuery().select("#project").boundingClientRect((res)=>{//最外层盒子节点
					uni.pageScrollTo({
						duration:0,
						scrollTop: data.top - res.top,//滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
					})
			　　}).exec()
			}).exec()
		},
		/**
		 * 删除评论
		 * @param {Object} comment
		 * @param {Number} index 数组下标
		 */
		removeComment(comment,index)
		{
			this.gShowModal("您确定删除该评价?",() => {
				/* 评价附件 */
				if(comment.resourceId){
					deleteRemark(comment.resourceId)
				}
				/* 公开评论 */
				else {
					deletePublicComment(comment.id)
				}
				this.arr_comments.splice(index,1)
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
	background-color var(--origin3)
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
			font-size 26rpx
		.values
			margin-left 5px
			&.arr
				display flex
				flex-wrap wrap
				.val
					margin 0 5px 5px 0
					font-size 22rpx
			.val
				padding 1px 20px
				border-radius 22px
				background-color var(--origin4)
				color var(--gray1)
				font-weight 24rpx
				font-size 24rpx
		/* 描述 */
		.intro
			width 100%
			border-radius 8px
			padding 2px
			border 2px solid var(--origin2)
	.header
		display flex
		align-items flex-start
		.right
			position relative
			flex 1
			margin-left 10px
		.item
			/* 左右布局成员和统计 */
			.flex
				display flex
				align-items flex-start
				.claim
					flex 1
					button
						padding 0 15px
						line-height 2
						display inline-block
			/* 统计信息 */
			.statistics
				.read, .collect
					margin-bottom 10px
					display flex
					align-items center
					font-size 20rpx
					color var(--origin1)
					.iconfont
						margin-right 2px
						font-size 20rpx
			.values
				flex 1
				/* 项目名称 */
				.name
					background-color #FFFFFF
					color var(--black)
					font-weight 700
					font-size 24rpx
					text-align center
			
	.content
		margin-bottom 10px
		padding 10px 15px
		border-radius 16px
		background-color #FFFFFF
		/* 审核中项目通知 */
		.unpassed-hint
			margin-bottom 5px
			color var(--origin1)
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
						font-size 20rpx
						font-weight 400
						line-height 1
						text-align center
		/* 评论内容 */
		.comment
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
				.user-info
					display flex
					align-items center
					.name
						padding 0 10px
						border-radius 22px
						font-size 22rpx
						background-color var(--origin2)
						color #FFFFFF
					.score
						margin-left 5px
						color var(--origin2)
						font-size 22rpx
						display flex
						align-items center
						.iconfont
							margin-left 2px
							font-size 20rpx
					.time
						color var(--gray2)
						font-size 20rpx
				.container
					padding 5px 0
				.file-control
					font-size 20rpx
					display flex
					align-items center
					justify-content space-between
					.filename
						color var(--gray2)
						
					.iconfont
						color var(--origin1)
		/* 评论提示 */
		.remark
			font-size 20rpx
			margin-top 5px
			color var(--gray2)
</style>
