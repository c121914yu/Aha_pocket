<!-- 
	项目文件管理
	author yjl
 -->
<template>
	<view class="project-file content">
		<!-- 附件列表 -->
		<view class="head" @click="onclickAddFile">
			<text class="h3">上传附件:</text>
			<text class="add iconfont icon-tianjia"></text>
		</view>
		<view style="color: var(--gray2);" class="mini">(注: 附件必须小于500M,上传成功后附件会进入审核状态,仅项目成员可见,审核通过后附件不可删除,请确认后再上传)</view>
		<view 
			class="file"
			v-for="(file,index) in arr_files"
			:key="index"
			@click="onclickFile(index)">
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
			@click="onclickUpload">
			{{btnText}}
		</button>
		<button v-if="uploading" class="uploading" loading>上传中,请勿离开界面</button>
		<view v-if="uploading" class="mask"></view>
		
		<set-file 
			v-if="setFileIndex!==null" 
			:fileInfo="arr_files[setFileIndex]"
			:level="level"
			@close="setFileIndex=null" 
			@success="changeFileInfo">
		</set-file>
        <!-- 加载动画 -->
        <load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getResources,getFilesSignature,postResource,putResource,deleteResource } from "@/static/request/api_project.js"
import SetFile from "./SetFile"
export default {
	components: {
		"set-file": SetFile
	},
	props: {
		projectId: {
			type: String,
			default: 0
		},
		level: Number
	},
	data() {
		return {
			arr_files: [],
			setFileIndex: null,
			uploading: false,
		}
	},
	computed:{
		btnText(){
			for(let i=0;i<this.arr_files.length;i++){
				if(this.arr_files[i].status !== 2) {
					return "开始上传"
				}
			}
			return "已全部上传"
		}
	},
	methods: {
		/**
		 * 初始化
		 */
		initData()
		{
			/* 请求个人项目的所有附件，同步附件信息 */
			getResources({
				projectId: this.projectId,
				edit: true
			})
			.then(res => {
				this.arr_files = res.data.map(file => ({
						...file,
						status: 2,
						progress: 100
				}))
			})
		},
	    /**
		 * 添加文件
		 */
		onclickAddFile()
		{
			const renderSize = (fsize) => {
				const unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB")
				let srcsize = parseFloat(fsize)
				let index = Math.floor(Math.log(srcsize) / Math.log(1024))
				let size = (srcsize / Math.pow(1024,index)).toFixed(2)
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
				const typeId = getApp().globalData.garr_fileClassify[3]
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
				this.arr_files.push(data)
				this.setFileIndex = this.arr_files.length - 1
				this.gLoading(this,false)
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
			this.gMenuPicker(["图片","视频","文档/PPT","其他"])
			.then(res => {
				this.gLoading(this,true)
				switch(res) {
					case "图片": 
						chooseFile("image",0)
						break
					case "视频":
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
										name: "演示视频",
										path: video.tempFilePath,
										size: video.size * 1000
									},1)
								},
								fail: (err) => {
									console.log(err);
									addFile({
										name: "演示视频",
										path: res[1].tempFilePath,
										size: res[1].size
									},1)
								}
							})
						})
						.catch(() => this.gLoading(this,false))
						break
					case "文档/PPT":
						chooseFile("file",2)
						break
					case "其他":
						chooseFile("file",3)
						break
				}
			})
		},
		/**
		 * 点击文件，打开操作菜单
		 * @param { Number } index
		 */
		onclickFile(index)
		{
			const file = this.arr_files[index]
			/* 若已经通过审核，直接打开设置界面 */
			if(file.passed){
				this.setFileIndex = index
				return
			}
			this.gMenuPicker(["修改附件信息", "删除附件"])
			.then(res => {
				switch(res) {
					case "修改附件信息":
						this.setFileIndex = index
						break
					case "删除附件":
						this.removeFile(index)
						break
				}
			})
		},
	    /**
		 * 删除文件
		 * @param {Object} index
		 */
		removeFile(index)
		{
			this.gShowModal(`确认删除 ${this.arr_files[index].name}?`,() => {
					if(this.arr_files[index].status === 2){
						deleteResource(this.arr_files[index].id)
					}
					this.arr_files.splice(index,1)
					this.gToastMsg("删除成功")
				}
			)
		},
		/**
		 * 根据setFileIndex修改文件信息
		 * @param { Object } file 修改后文件信息
		 */
		changeFileInfo(file)
		{
			if(this.arr_files[this.setFileIndex].status === 2) {
				putResource(this.arr_files[this.setFileIndex].id,file)
			}
			this.arr_files[this.setFileIndex].name = file.name
			this.arr_files[this.setFileIndex].price = file.price
			this.arr_files[this.setFileIndex].typeId = file.typeId
			this.gToastMsg("修改成功")
			this.setFileIndex = null
		},
	    /**
		 * 点击上传附件
		 */
		async onclickUpload()
		{
			if(this.arr_files.length === 0 || this.btnText === "已全部上传"){
				return
			}
			this.uploading = true
			this.gLoading(this,true)
			
			try{
				/* 获取签名 */
				const files = this.arr_files.filter(item => item.status !== 2)
				const signs = await Promise.all(files.map((file,i) => {
					const filename = `${Date.now()}${i}.${file.name.split('.')[1]}`
					return getFilesSignature(this.projectId,filename)
				}))
				/* 上传文件 */
				const upRes = await Promise.allSettled(signs.map((sign,i) => {
					const file = files[i]
					return  this.gUploadFile(file.url,sign.data,(progress) => {
								file.progress = progress
						    })
				}))
				/* 往数据库添加上传成功的文件 */
				const updateFiles = await Promise.all(upRes.map((res,i) => {
					const file = files[i]
					if(res.status === "fulfilled") {
						file.status = 2
						file.filename = signs[i].data.filename
						return postResource(this.projectId,{
												name: file.name,
												filename: file.filename,
												price: file.price,
												typeId: file.typeId,
												fileType: file.fileType,
												discount: 0
											})
					}
					else {
						file.status = 3
					}
				}))
				/* 更新id */
				for(const i in updateFiles) {
					files[i].id =updateFiles[i].data
				}
				this.uploading = false
				this.gLoading(this,false)
				this.gToastSuccess("上传完成")
				console.log(this.arr_files)
			} catch(e){
				console.log(e)
				this.gToastError("上传文件失败")
			}
			return
			let upNum = 0 // 计数器
			this.arr_files.forEach(async (file,index) => {
				upNum++
				if(file.status !== 2) {
					try {
						file.status = 1
						/* 获取签名 */
						const filename = `${Date.now()}.${file.name.split('.')[1]}`
						const sign = await getFilesSignature(this.projectId,filename)
						/* 上传文件 */
						await this.gUploadFile(file.url,sign.data,(progress) => {
							file.progress = progress
						})
						/* 上传成功 */
						file.status = 2
						file.filename = sign.data.filename
						/* 往数据添加文件 */
						file.id =   (await postResource(this.projectId,{
										name: file.name,
										filename: file.filename,
										price: file.price,
										typeId: file.typeId,
										fileType: file.fileType,
										discount: 0
									})).data
						console.log(file)
					} catch(e) {
						file.status = 3
						this.gToastError("上传文件失败")
						console.log(e);
					}
				}
				/* 全部上传完成 */
				if(upNum === this.arr_files.length) {
					this.uploading = false
					this.gLoading(this,false)
					this.gToastSuccess("上传完成!")
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.project-file
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
