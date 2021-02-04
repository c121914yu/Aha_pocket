<template>
	<view class="content">
		<!-- 附件列表 -->
		<view class="head">
			<text class="h3">上传附件:</text>
			<text class="add iconfont icon-tianjia" @click="chooseFile"></text>
		</view>
		<view style="color: var(--font-dark);" class="remark">(注: 附件必须小于500M)</view>
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
		<button v-if="!uploading" class="startUpload" @click="upload">{{btnText}}</button>
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
			if(this.files.length > 10){
				this.gToastMsg("文件数量不能大于10")
				return
			}
            this.gLoading(this,true)
			/* 选择文件API */
			wx.chooseMessageFile({
				count: 10,
				type: 'all',
				success: (res) => {
					/* 限制50M */
					let files = res.tempFiles.filter(file => file.size < 500000000)
					if(files.length < res.tempFiles.length){
						this.gToastError("文件大于500M")
					}
					this.files = this.files.concat(files.map(file => {
						return{
							name: file.name,
							url: file.path,
							size: renderSize(file.size),
							type: getApp().globalData.arr_fileTypes.find((item) => item.reg.test(file.name)),
							progress: 0,
							status: 0, // 0 待上传，1 上传中，2上传完成，3上传失败
							price: 100,
						}
					}))
					console.log(this.files);
				},
				fail: err => {
					console.log(err)
					if(err.errMsg !== "chooseMessageFile:fail cancel")
					{
						this.gToastError(err.errMsg)
					}
				},
				complete: () => {
					this.gLoading(this,false)
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
			// console.log(file);
			let itemList = ["修改附件信息", "删除附件"]
			if(file.type.value === 1){
				itemList.unshift("设置预览片段")
			}
			uni.showActionSheet({
				itemList,
				success: (res) => {
					if (itemList[res.tapIndex] === "修改附件信息") {
						this.setFileIndex = index
					} 
					else if (itemList[res.tapIndex] === "删除附件") {
						this.removeFile(index)
					}
					/* 设置视频预览片段 */
					else if (itemList[res.tapIndex] === "设置预览片段") {
						if(file.status !== 2){
							this.gToastError("请先上传该视频")
						}
						else{
							wx.openVideoEditor({
								filePath: file.url,
								success: (res) => {
									if(res.size > 20000000){
										this.gToastError("大于20M")
									}
									else{
										/* 上传预览视频 */
										wx.previewMedia({
											sources: [{
												url: res.tempFilePath,
												type: "video"
											}],
											showmenu: false
										})
										console.log(res.tempFilePath);
									}
								}
							})
						}
					}
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
					this.gToastSuccess("删除成功")
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
			this.gToastSuccess("修改成功")
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
				this.files[index].status = 2
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
				/* 非上传成功状态 */
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
				getFilesSignature(this.projectId,file.name)
				.then(signature => {
					signature = signature.data
					/* 上传文件 */
					const cos = new COS({getAuthorization: function (options, callback) {callback({Authorization: signature.authorization})}})
					/* 转化成二进制 */
					wx.getFileSystemManager().readFile({
						filePath: file.url,
						success: (res) => {
							/* 上传文件 */
							cos.putObject({
								Bucket: signature.bucketName,
								Region: signature.region,
								Key: signature.filename,
								Body: res.data,
								// FilePath: file.url,
								onProgress: (info) => {
									console.log(JSON.stringify(info))
									this.files[index].progress = info.percent*100
								}
							}, (err,data) => {
								if(err){
									showErr(err,index)
								}
								else{
									this.files[index].status = 2
									this.files[index].filename = signature.filename
									/* 更新至数据库 */
									postResource(this.projectId,{
										name: file.name,
										filename: file.filename,
										price: file.price,
										type: file.type.value,
										discount: 0
									})
									.then(res => {
										this.files[index].id = res.data.id
										nextFile(++index)
									})
									.catch(err => {
										showErr(err,index)
									})
								}
							})
						},
						fail: (err) => {
							showErr(err,index)
						}
					})
				})
				.catch(err => {
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
