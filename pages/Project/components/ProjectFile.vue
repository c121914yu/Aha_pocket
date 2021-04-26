<template>
	<view class="content">
		<!-- 附件列表 -->
		<view class="head" @click="chooseFile">
			<text class="h3">上传附件:</text>
			<text class="add iconfont icon-tianjia"></text>
		</view>
		<view style="color: var(--gray2);" class="mini">(注: 附件必须小于500M,上传成功后附件会进入审核状态,仅项目成员可见,审核通过后附件不可删除,请确认后再上传)</view>
		<view 
			class="file"
			v-for="(file,index) in files"
			:key="index"
			@click="clickFile(index)">
			<!-- 文件信息 -->
			<view class="info">
				<text class="name">{{file.name}}</text>
				<text class="size strong">{{file.size}}</text>
			</view>
			<!-- 进度条 -->
			<progress 
				class="progress"
				:percent="file.progress" 
				show-info 
				stroke-width="3" 
				border-radius="10"
				font-size="10"
				backgroundColor="#FFFFFF"
				activeColor="#956134"
				active="true"
				active-mode="forwards"
				duration="5"/>
			<!-- 操作及提示 -->
			<view class="control">
				<view style="background-color: var(--gray2)" v-if="file.status === 0" class="text">待上传</view>
				<view style="background-color: var(--origin1)" v-if="file.status === 1" class="text">上传中</view>
				<view style="background-color: #67C23A" v-if="file.status === 2" class="text">上传成功</view>
				<view style="background-color: #F56C6C" v-if="file.status === 3" class="text">上传失败</view>
				<view class="price"><text class="iconfont icon-qian"></text>{{file.price}}</view>
			</view>
		</view>
		<!-- 上传按键 -->
		<button 
			v-if="!uploading" 
			class="startUpload" 
			:class="btnText === '已全部上传' ? 'forbid' : ''"
			@click="upload">
			{{btnText}}
		</button>
		<button v-if="uploading" class="uploading" loading>上传中,请勿离开界面</button>
		<view v-if="uploading" class="mask"></view>
		
		<SetFile 
			v-if="setFileIndex!==null" 
			:fileInfo="files[setFileIndex]"
			:level="level"
			@close="setFileIndex=null" 
			@success="changeFileInfo">
		</SetFile>
        <!-- 加载动画 -->
        <Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getFilesSignature,postResource,putResource,deleteResource } from "@/static/request/api_project.js"
import SetFile from "./SetFile"
const COS = require('@/static/js/COS.js')
export default {
	props: {
		projectId: String,
		level: Number
	},
	data() {
		return {
			files: [],
			uploading: false,
			setFileIndex: null
		}
	},
	computed:{
		btnText(){
			for(let i=0;i<this.files.length;i++){
				if(this.files[i].status !== 2)
					return "开始上传"
			}
			return "已全部上传"
		}
	},
	components: {
		SetFile
	},
	methods: {
		/*
			name: 选择附件
			description: 选择需要上传的附件
			time: 2020/10/24
		*/
		chooseFile()
		{
			const renderSize = (fsize) => {
				const unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB")
				let index = 0
				let srcsize = parseFloat(fsize)
				index = Math.floor(Math.log(srcsize) / Math.log(1024))
				let size = srcsize / Math.pow(1024,index)
				size = size.toFixed(2)
				return size + unitArr[index]
			}
			/* file: name,path,size */
			const addFile = (file,fileType) => {
				/* 限制500M */
				if(file.size > 500000000){
					this.gToastError("文件大于500M")
					return
				}
				/* 计算价格，取平均值 */
				const award = getApp().globalData.garr_prizeLevels.find(item => item.value === this.level)
				const typeId = getApp().globalData.arr_fileClassify[3]
				const data = {
					name: file.name,
					url: file.path,
					size: renderSize(file.size),
					typeId: typeId.value,
					fileType,
					progress: 0,
					status: 0, // 0 待上传，1 上传中，2上传完成，3上传失败
					price: (award.max + award.min) * typeId.rate / 2
				}
				this.files.push(data)
				this.setFileIndex = this.files.length - 1
				this.gLoading(this,false)
				console.log(this.files)
			}
			const chooseFile = (type,fileType) => {
				/* 除视频外的文件 */
				wx.chooseMessageFile({
					count: 1,
					type,
					success: (res) => {
						addFile(res.tempFiles[0],fileType)
					},
					fail: (err) => {
						if(err.errMsg !== "chooseMessageFile:fail cancel")
						{
							this.gToastError(err.errMsg)
						}
						this.gLoading(this,false)
					}
				})
			}
			/* 选择上传的文件类型 */
			this.gMenuPicker([
				{label: "图片",value: 0},
				{label: "视频",value: 1},
				{label: "文档/PPT",value: 2},
				{label: "其他",value: 3},
			])
			.then(res => {
				if(!res){
					return
				}
				this.gLoading(this,true)
				let type = ""
				if(res.value === 0){
					chooseFile("image",res.value)
				}
				else if(res.value === 2 || res.value === 3){
					chooseFile("file",res.value)
				}
				else if(res.value === 1){
					/* 选择视频，先压缩再上传 */
					uni.chooseVideo({
						sourceType: ['album'],
						compressed: false,
					})
					.then(res => {
						uni.compressVideo({
							src: res[1].tempFilePath,
							quality: "high",
							success: (video) => {
								addFile({
									name: "视频",
									path: video.tempFilePath,
									size: video.size * 1000
								},1)
							},
							fail: (err) => {
								console.log(err);
								addFile({
									name: "视频",
									path: res[1].tempFilePath,
									size: res[1].size
								},1)
							}
						})
					})
					.catch(err => {
						this.gLoading(this,false)
					})
				}
			})
		},
		/* 点击文件，打开操作菜单 */
		clickFile(index)
		{
			const file = this.files[index]
			/* 若已经通过，直接打开设置界面 */
			if(file.passed){
				this.setFileIndex = index
				return
			}
			this.gMenuPicker(["修改附件信息", "删除附件"])
			.then(res => {
				if (res === "修改附件信息") {
					this.setFileIndex = index
				}
				else if (res === "删除附件") {
					this.removeFile(index)
				}
			})
		},
		/* 
			name: 删除文件
			desc: 根据下标删除附件列表,需要先调用modal提示框
			@params index: Number,下标
			@change this.files: Array,附件列表
			time: 2020/10/25
		*/
		removeFile(index)
		{
			this.gShowModal(
				`确认删除 ${this.files[index].name}?`,
				() => {
					if(this.files[index].status === 2){
						deleteResource(this.files[index].id)
					}
					this.files.splice(index,1)
					this.gToastMsg("删除成功")
				}
			)
		},
		/* 根据setFileIndex修改文件信息 */
		changeFileInfo(e)
		{
			if(this.files[this.setFileIndex].status === 2) {
				putResource(this.files[this.setFileIndex].id,e)
			}
			for(let key in e){
				this.files[this.setFileIndex][key] = e[key]
			}
			this.gToastMsg("修改成功")
			this.setFileIndex = null
		},
		/* 
			上传附件
			time: 2020/12/30
		*/
		upload()
		{
			if(this.files.length === 0){
				return
			}
			if(this.btnText === "已全部上传"){
				return
			}
			this.uploading = true
			this.gLoading(this,true)
			/* 提示错误 */
			const showErr = (err,index) => {
				console.error(err);
				this.files[index].status = 3
				this.gToastError("上传错误")
				this.gLoading(this,false)
				this.uploading = false
			}
			/* 下一个,传入下一个index */
			const nextFile = (index) => {
				if(index === this.files.length){
					this.gToastSuccess("已全部上传")
					this.uploading = false
					this.gLoading(this,false)
				}
				/* 上传成功状态,上传下一个 */
				else if(this.files[index].status === 2){
					nextFile(++index)
				}
				else{
					upFile(index)
				}
			}
			/* 上传文件 */
			const upFile = (index) => {
				const file = this.files[index]
				this.files[index].status = 1
				/* 获取签名 */
				const filename = `${Date.now()}.${file.name.split('.')[1]}`
				getFilesSignature(this.projectId,filename)
				.then(signature => {
					/* 上传文件 */
					this.gUploadFile(file.url,signature.data,(progress) => {
						this.files[index].progress = progress
					})
					.then(res => {
						this.files[index].status = 2
						this.files[index].filename = signature.data.filename
						/* 更新至数据库 */
						postResource(this.projectId,{
							name: file.name,
							filename: this.files[index].filename,
							price: file.price,
							typeId: file.typeId,
							fileType: file.fileType,
							discount: 0
						})
						.then(res => {
							this.files[index].id = res.data
							nextFile(++index)
						})
						.catch(err => {
							showErr(err,index)
						})
					})
					.catch(errr => {
						showErr(err,index)
					})
				})
				.catch(errr => {
					showErr(err,index)
				})
			}
			nextFile(0)
		}
	}
}
</script>

<style lang="stylus" scoped>
.head .iconfont
	margin-left 10px
	font-size 40rpx
	color var(--origin2)
/* 资源列表 */
.file
	margin 8px 0
	position relative
	padding 10rpx
	border-radius 22rpx
	background-color var(--origin3)
	font-size 22rpx
	.info,.control
		display flex
		flex-wrap wrap
		align-items center
		justify-content space-between
		.text
			color #FFFFFF
			font-size 18rpx
			padding 0 5px
			border-radius 4px
		.price
			display flex
			align-items center
			.iconfont
				margin-right 2px
				font-size 24rpx
				font-weight 400
				color var(--origin1)
		.size
			color var(--origin1)
	.progress
		width 100%
/* 已全部上传 & 上传中 */
.startUpload,.uploading
	border-radius 22px
	padding 0 3px
	&.forbid
		background-color var(--gray2)
		&:active
			transform none
/* 上传中 */
.uploading
	background-color var(--gray2)
	&:active
		transform none
.mask
	z-index 10
	position fixed
	top 0
	left 0
	width 100vw
	height 100vh
</style>
