<template>
	<view class="content">
		<!-- 附件列表 -->
		<view class="head">
			<text class="h3">上传附件:</text>
			<text class="add iconfont icon-tianjia" @click="chooseFile"></text>
		</view>
		<view class="remark">(注:手机选择文件可从文件助手或聊天记录中选取，超过25M文件请用电脑选取。)</view>
		<view 
			class="file"
			v-for="(file,index) in files"
			:key="index">
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
				font-size="12"
				backgroundColor="#FFFFFF"
				activeColor="#f8b86b"
				active="true"
				active-mode="forwards"/>
			<!-- 操作及提示 -->
			<view class="control">
				<text v-if="file.status === 0" class="text">待上传</text>
				<text style="color: #956134" v-if="file.status === 1" class="text">上传中</text>
				<text style="color: #67C23A" v-if="file.status === 2" class="text">上传成功</text>
				<text style="color: #F56C6C" v-if="file.status === 3" class="text">上传失败</text>
				<text class="remove iconfont icon-remove" @click="removeFile(index)"></text>
			</view>
		</view>
		<!-- 上传按键 -->
		<button v-if="!uploading" class="startUpload" @click="upload">{{btnText}}</button>
		<button v-if="uploading" loading class="uploading">上传中,请勿离开界面</button>
		<view v-if="uploading" class="mask"></view>
	</view>
</template>

<script>
import { getFilesSignature,postResource,deleteResource } from "@/static/request/api_project.js"
export default {
	data() {
		return {
			files: [],
			uploading: false
		}
	},
	props: {
		projectId: String
	},
	methods: {
		/*
			name: 选择附件
			description: 选择需要上传的附件
			time: 2020/10/24
		*/
		chooseFile()
		{
			function renderSize(fsize){
				const unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB")
				let index = 0
				let srcsize = parseFloat(fsize)
				index = Math.floor(Math.log(srcsize) / Math.log(1024))
				let size = srcsize / Math.pow(1024,index)
				size = size.toFixed(2)
				return size + unitArr[index]
			}
			uni.showLoading({
				title: "选择中..."
			})
			/* 选择文件API */
			wx.chooseMessageFile({
				count: 10,
				type: 'all',
				success: (res) => {
					this.files.push(...res.tempFiles.map(file => {
						return{
							name: file.name,
							url: file.path,
							size: renderSize(file.size),
							progress: 0,
							status: 0 // 0 待上传，1 上传中，2上传完成，3上传失败
						}
					})) 
				},
				fail: (err) => {
					console.log(err)
					if(err.errMsg !== "chooseMessageFile:fail cancel")
					{
						this.gToastError(err.errMsg)
					}
				},
				complete: () => {
					uni.hideLoading()
				}
			})
		},
		/* 
			name: 删除文件
			desc: 根据下标删除附件列表,需要先调用modal提示框
			input:
						index: Number,下标
			change: 
						this.files: Array,附件列表
			time: 2020/10/25
		*/
		removeFile(index)
		{
			this.gShowModal(
				`确认删除 ${this.files[index].name}?`,
				() => {
					this.files.splice(index,1)
				}
			)
		},
		/* 
			name: 上传附近
			desc: 调用签名接口，上传附件
		*/
	 upload()
	 {
		 if(this.files.length === 0)
			 return
		 this.uploading = true
		 
		 /* 请求服务器更新资源状态 */
		 const api_postResource = async (file) => {
			 try{
				 const data = await postResource(this.projectId,{
					 type: 0,
					 name: file.name,
					 filename: file.filename
				 })
				 console.log(data)
				 return true
			 }
			 catch(err){
				 return false
			 }
		 }
		 
		 /* 获取签名 */
		 getFilesSignature(this.projectId)
		 .then(sign => {
			 const signature = sign.data
			 /* 开始上传任务，传入对应资源的下标 */
			 const startUpload = (i) => {
				 /* 
					  判断文件是否是待上传状态
					  是上传状态且非最后一个，则上传下一个
						是最后一个附件则提示完成上传
				 */
				 if(this.files[i].status === 2){
					 if(i < this.files.length-1)
						 startUpload(i+1)
						else{
							this.gToastSuccess("已全部上传")
							this.uploading = false
						}
						return
				 }
				 this.files[i].status = 1
				 this.files[i].filename = `${signature.dir}${Date.now()}/${this.files[i].name}`
				 /* 上传文件 */
				 const uploadTask =	uni.uploadFile({
				 		url: signature.host,
				 		filePath: this.files[i].url,
				 		name: "file",
				 		formData: {
				 			key: this.files[i].filename, // 文件名
				 			policy: signature.policy,
				 			OSSAccessKeyId: signature.accessid,
				 			signature: signature.signature
				 		},
						success: async(res) => {
							/* 上传文件成功 */
							if(res.statusCode === 204){
								/* 判断更新资源文件是否成功 */
								if(await api_postResource(this.files[i]))
									this.files[i].status = 2
								else
									this.files[i].status = 3
							}
							else
								this.files[i].status = 3
						},
						fail: (err) => {
							console.log(err)
							this.files[i].status = 3
						},
						complete: () => {
							/* 判断是否需要上传下一个文件或是上传完成 */
							if(i < this.files.length-1)
							  startUpload(i+1)
							else{
								this.gToastSuccess("已全部上传")
								this.uploading = false
							}
						}
				 	})
					uploadTask.onProgressUpdate(res => {this.files[i].progress = res.progress})
			 }
			 startUpload(0)
		 })
		 .catch(err => {
			 console.log("无法获取上传凭证")
			 this.uploading = false
		 })
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
		.size
			color var(--origin1)
		.remove
			color #F56C6C
			font-size 40rpx
	.progress
		width 100%
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
