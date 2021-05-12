<!-- 已经购买的项目 -->
<template>
	<view class="purchased-projects">
		<view class="search">
			<search-input placeholder="搜索相关项目" v-model="searchText"></search-input>
		</view>
		<!-- 统计 -->
		<view class="statistics">
			<view style="border-bottom-left-radius: 22px;" class="item">
				<view>购买附件数量</view>
				<view class="amount">{{purchaseAmount}}</view>
			</view>
			<view class="item">
				<view>相关项目数量</view>
				<view class="amount">{{arr_project.length}}</view>
			</view>
			<view style="border-bottom-right-radius: 22px;" class="item">
				<view>花费Aha点</view>
				<view class="amount">{{purchasePoint}}</view>
			</view>
		</view>
		<!-- 项目卡片 -->
		<view class="projects">
			<view 
				class="project"
				v-for="(project,index1) in arr_project"
				:key="index1">
				<navigator 
					class="title" 
					:url="'Project?id=' + project.project.id">
					{{project.project.name}}
				</navigator>
				<view class="files">
					<view 
						class="file"
						v-for="(file,index2) in project.files"
						:key="index2"
						@click="readFile(file,index1,index2)">
						{{file.name}}
					</view>
				</view>
			</view>
		</view>
		<!-- 提示文字 -->
		<view class="hint center small">已加载全部</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getPurchased } from "@/static/request/api_userInfo.js"
import { getProject,getLoadSignature } from "../../static/request/api_project.js"
import ProjectCard from "./components/ProjectCard.vue"
import ProjectHead from "./components/ProjectHead.vue"
export default {
	data() {
		return {
			purchaseAmount: 0,
			purchasePoint: 0,
			arr_projectId: [],
			arr_project: [],
			pageNum: 1,
			pageSize: 20,
			is_showAll: false, 
		}
	},
	components: {
		ProjectCard,
		ProjectHead
	},
	onLoad() {
		// this.gUndesign()
		this.loadPurchased()
	},
	methods: {
		/* 获取已购数据 */
		loadPurchased(init=false)
		{	
			this.gLoading(this,true)
			getPurchased()
			.then(res => {
				console.log(res.data);
				this.purchaseAmount = res.data.length
				/* 遍历所有附件，将其按项目分组 */
				res.data.forEach(file => {
					/* 判断是否已经在数组中 */
					const index = this.arr_projectId.indexOf(file.resource.projectId)
					/* 第一次加载到该项目 */
					if(index === -1){
						this.arr_projectId.push(file.resource.projectId)
						this.arr_project.push({
							files: [file.resource],
							project: null
						})
						this.getProject(file.resource.projectId,this.arr_projectId.length-1)
					}
					else{
						this.arr_project[index].files.push(file.resource)
					}
				})
				this.gLoading(this,false)
				console.log(this.arr_project);
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		},
		/* 获取项目信息并更新到对应下标的数组中 */
		getProject(id,index)
		{
			getProject(id)
			.then(res => {
				this.arr_project[index].project = res.data
				// console.log(this.arr_project[index]);
			})
		},
		/*
			阅读项目, 先判断类型,文档类跳转预览，其他类型需要获取下载地址再进行操作
			@params file:Object,文件信息
			@params index: Number,文件数组下标
		*/
		readFile(file,index1,index2)
		{
			const type = getApp().globalData.garr_fileTypes.find(item => item.reg.test(file.filename)).value
			/* 文档类跳转readFile界面 */
			if(type === 2){
				uni.navigateTo({
					url: "ReadFile?id=" + file.id
				})
			}
			else{
				this.gLoading(this,true)
				if(file.url){
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
						/* 复制到剪切板 */
						uni.setClipboardData({
						    data: file.url,
							success: () => {
								this.gToastMsg("已复制下载链接")
							},
							complete: () => {
								this.gLoading(this,false)
							}
						})
					}
				}
				/* 没有缓存下载路径，请求签名路径后再回调该函数 */
				else {
					getLoadSignature(file.id)
					.then(res => {
						this.gGetFileUrl(res.data)
						.then(url => {
							this.arr_project[index1].files[index2].url = url
							this.readFile(this.arr_project[index1].files[index2],index1,index2)
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
	}
}
</script>

<style lang="stylus" scoped>
.purchased-projects
	background-color var(--white1)
	min-height 100vh
	.search
		background-color var(--origin2)
		padding 3px 5%
	/* 统计数据 */
	.statistics
		padding 5px
		background-color #FFFFFF
		border-bottom-left-radius 22px
		border-bottom-right-radius 22px
		text-align center
		padding 5px
		font-size 24rpx
		display grid
		grid-template-columns repeat(3,1fr)
		grid-gap 5px
		.item
			padding 5px 0
			background-color var(--origin4)
			color var(--gray1)
		.amount
			margin 2px auto
			width 50%
			color var(--origin2)
			background-color #FFFFFF
			border-radius 22px
			font-weight 700
	/* 项目 */
	.projects
		margin 15px 5%
		.project
			margin 10px 0
			box-shadow var(--shadow2)
			border-radius 8px
			overflow hidden
			.title
				padding 8px 10px
				background-color var(--origin3)
				font-size 24rpx
				font-weight 700
				color #FFFFFF
				display block
			.files
				background-color #FFFFFF
				.file
					position relative
					padding 10px 5px 10px 20px
					font-size 22rpx
					border-bottom var(--border2)
					display flex
					align-items center
					&::before
						content ''
						position absolute
						left 9px
						width 5px
						height 5px
						border-radius 50%
						background-color var(--origin1)
	/* 提示文字 */
	.hint
		color var(--gray2)
</style>
