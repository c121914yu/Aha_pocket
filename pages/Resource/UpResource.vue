<!-- 资源分享 -->
<template>
	<view class="up-resource">
		<!-- 标题 -->
		<view class="info title">
			<input 
				type="text" 
				placeholder="资源标题" 
				v-model="title"/>
		</view>
		<!-- 选择容器 -->
		<view class="info picker-content">
			<!-- 完成度 -->
			<view class="finish-rate">
				<text class="head">完成程度</text>
				<SPicker
					:range="finishRates"
					v-model="finishRate">
				</SPicker>
			</view>
			<!-- 资源类型 -->
			<view class="classify">
				<text class="head">资源类型</text>
				<SPicker
					:range="AccessoriesClassify"
					v-model="classify">
				</SPicker>
			</view>
		</view>
		<!-- 标签 -->
		<view class="info tags">
			<text class="head">标签</text>
			<input 
				type="text" 
				placeholder-class="placeholderStyle" 
				placeholder="不同标签间空格隔开."
				@input="inputTags"/>
			<view 
				class="tag"
				v-for="(tag,index) in tags"
				:key="index">
				{{tag}}
			</view>
		</view>
		<!-- 获奖情况 -->
		<view class="info prizes">
			<view class="head">
				获奖情况
				<text class="iconfont icon-tianjia" @click="addPrize"></text>
			</view>
			<view 
				class="prize"
				v-for="(prize,index) in prizeList"
				:key="index">
				<!-- 带搜索的输入框 -->
				<SearchInput 
					:allResults="MatchName"
					placeholder="获奖名称"
					v-model="prize.name"
					@blur="blurMathName($event,index)">
				</SearchInput>
				<!-- 分类，如果该赛事不存在MatchName中 -->
				<view 
					v-if="prize.isShowClassify"
					class="classify">
					<text class="title">赛事分类</text>
					<SPicker
						:range="finishRates"
						v-model="prize.matchClassify">
					</SPicker>
				</view>
				<!-- 获奖等级 -->
				<view class="prize-grade">
					<text class="title">获奖等级</text>
					<SPicker
						:range="prizeGrades"
						v-model="prize.level">
					</SPicker>
					<!-- 未选择图片 -->
					<view 
						class="testify" 
						v-if="!prize.testifyUrl"
						@click="addTestify(index)">
						<text class="iconfont icon-tianjia"></text>
						<text>添加证明</text>
					</view>
					<!-- 已选择图片 -->
					<view 
						v-else
						class="testify"
						@click="readTestify(prize.testifyUrl)">
						<text class="iconfont icon-readed" ></text>
						<text>查看证明</text>
					</view>
					<icon
						class="remove"
						type="clear" 
						size="24" 
						color="#ff0000"
						@click="removePrize(index)"/>
				</view>
			</view>
		</view>
		<!-- 作者信息  -->
		<view class="info author">
			<text class="head">作者信息</text>
			<view class="input">
				<input 
					class="name" 
					type="text" 
					placeholder-class="placeholderStyle" 
					placeholder="作者名称" 
					v-model="authorName"/>
				<input 
					class="contact" 
					type="text" 
					placeholder-class="placeholderStyle" 
					placeholder="联系方式" 
					v-model="authorContace"/>
			</view>
		</view>
		<!-- 文件选择 -->
		<view class="info files">
			<view class="head">
				附件列表
				<text class="iconfont icon-tianjia" @click="chooseFile"></text>
			</view>
			<text class="remark">*手机选择文件需要先发送至文件助手或从聊天记录中选择,超过25M的文件请用电脑选择。</text>
			<view 
				v-if="accessories.length > 0"
				class="list">
				<view
					class="file"
					v-for="(file,index) in accessories"
					:key="index">
					<view class="file-info small">
						<view>{{file.name}}</view>
						<view class="size">{{file.size}}</view>
					</view>
					<icon 
						class="remove"
						type="clear" 
						size="22" 
						color="#ff0000"
						@click="removeFile(index)"/>
				</view>
			</view>
		</view>
		<!-- 介绍，支持Markdown -->
		<view class="info description">
			<text class="head">资源描述</text>
			<button @click="isEdit=true">进入markdown编辑</button>
		</view>
		<view v-if="isEdit" class="edit-content">
			<MdEdit 
				placeholder="请输入内容"
				:delta="descriptionMD"
				@editOk="editOk"
				@input="descriptionMD=$event">
			</MdEdit>
		</view>
		<view v-html="descriptionHTML"></view>
		<!-- 上传 -->
		<button class="publish" @click="uploadFiles">发布</button>
	</view>
</template>

<script>
import { getOssSignature,postResource } from "@/static/request/api_resource.js"
export default {
	data() {
		const AccessoriesClassify = getApp().globalData.AccessoriesClassify
		const MatchName = getApp().globalData.MatchName
		const prizeGrades = getApp().globalData.prizeGrades
		return {
			title: "",
			finishRate: "",
			classify: "",
			tags: [], // 标签
			descriptionHTML: "",
			descriptionMD: "",
			prizeList: [], // 获奖情况
			authorName: "", // 作者名称
			authorContace: "", // 作者联系方式
			accessories: [], // 附件
			finishRates: ["100%","80%-100%","50%-80%","0%-50%"], // 完成度数组
			AccessoriesClassify,
			MatchName,
			prizeGrades,
			isEdit: false
		}
	},
	methods: {
		/* 
			name: 输入标签
			desc: 监听输入标签，获取输入内容根据空格分隔
			input: 
						e: Object,input参数,e.detail.value:输入的值
			return: null
			change: 
							this.tags: Array,标签数组
			time: 2020/10/25
		*/
		inputTags(e)
		{
			const val = e.detail.value
			this.tags = val.split(" ").filter(tag => tag !== "")
		},
		/*
			name: 添加获奖
			desc: 追加一个获奖情况，包括名称，赛事，获奖等级，如果是自建赛事还需要选择赛事分类。
			change: 
							this.prizeList: Array,获奖数组
			time: 2020/10/25
		*/
		addPrize()
		{
			this.prizeList.push({
				name: "",
				matchClassify: "",
				isShowClassify: false,
				level: "",
				testifyUrl: ""
			})
		},
		/*
			name: 添加获奖证明
			desc: 添加一个获奖证明图片
			input:
						index: Number,获奖数组下标
			change: 
							this.prizeList[index].testifyUrl: String,获奖证明
			time: 2020/10/25
		*/
		addTestify(index)
		{
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success:  (img) => {
					this.prizeList[index].testifyUrl = img.tempFilePaths[0]
				}
			})
		},
		/*
			name: 输入比赛名称结束
			description: 获取比赛名称，与库中已有比赛配对，若不存在则表示为自建，需要用户选择分类
			input: 
						val: String,输入内容
						index: Numnber,对应数组 下标
			change:
							prizeList[index].isShowClassify: Boolean,是否展示分类
			time: 2020/10/24
		*/
		blurMathName(val,index)
		{
			if(this.MatchName.indexOf(val) === -1 && val !== "")
			{
				this.prizeList[index].isShowClassify = true
			}
			else
			{
				this.prizeList[index].isShowClassify = false
			}
		},
		/*
			name: 查看获奖证明
			desc: 查看获奖证明图片
			input:
						url: String,证明链接地址
			change: 
			time: 2020/10/26
		*/
		readTestify(url)
		{
			uni.previewImage({
				urls: [url]
			})
		},
		/*
			name: 删除获奖情况
			desc: 根据下标删除获奖列表,需要先调用modal提示框
			input:
						index: Number,下标
			change: 
						this.prizeList: Array,获奖列表
			time: 2020/10/25
		*/
		removePrize(index)
		{
			this.gShowModal(
				'确认删除该获奖记录?',
				() => {
					this.prizeList.splice(index,1)
				}
			)
		},
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
			  count: 5,
			  type: 'all',
			  success: (res) => {
					this.accessories.push(...res.tempFiles.map(file => {
						return{
							name: file.name,
							url: file.path,
							size: renderSize(file.size)
						}
					})) 
			  },
				fail: (err) => {
					console.log(err)
					this.gToastError(err.errMsg)
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
						this.accessories: Array,附件列表
			time: 2020/10/25
		*/
		removeFile(index)
		{
			this.gShowModal(
				`确认删除 ${this.accessories[index].name}?`,
				() => {
					this.accessories.splice(index,1)
				}
			)
		},
		editOk(html)
		{
			this.descriptionHTML = html
			this.isEdit = false
		},
		/* 
			name: 验证输入内容
			desc: 验证输入的资源内容
						若是已存在分类则选择分类填充matchClassify的值
						去掉isShowClassify
						添加testifyName值，取名为 /联系方式/时间戳
		*/
	  verifyInfo()
		{
			/* 整合数据 */
			const data = {
				title: this.title,
				finishRate: this.finishRate,
				classify: this.classify,
				tags: this.tags,
				prizeList:  JSON.parse(JSON.stringify(this.prizeList)),
				authorName: this.authorName,
				authorContace: this.authorContace,
				accessories: JSON.parse(JSON.stringify(this.accessories)),
				description: this.description
			}
			if(data.title === "")
			{
				this.gToastError("请输入资源标题")
				return false
			}
			if(data.finishRate === "")
			{
				this.gToastError("请选择完成程度")
				return false
			}
			if(data.classify === "")
			{
				this.gToastError("请选择资源类型")
				return false
			}
			if(data.authorName === "")
			{
				this.gToastError("请输入作者姓名")
				return false
			}
			if(data.authorContace === "")
			{
				this.gToastError("请输入联系方式")
				return false
			}
			if(data.accessories.length === 0)
			{
				this.gToastError("请选择附件")
				return false
			}
			/* 判断获奖证明 */
			for(let i=0;i<data.prizeList.length;i++){
				const prize = data.prizeList[i]
				if(prize.name === "")
				{
					this.gToastError("获奖名称为空")
					return false
				}
				if(prize.level === "")
				{
					this.gToastError("获奖等级为空")
					return false
				}
				if(prize.testifyUrl === "")
				{
					this.gToastError("获奖证明为空")
					return false
				}
				delete data.prizeList[i].isShowClassify
			}
			return data
		},
		/*
			name: 上传文件
			desc: 上传证明材料，附件，并对需要提交的数据进行整理
			time: 2020/10/26
		*/
		uploadFiles()
		{
			uni.showLoading({
				title: "获取签名中...",
				mask: true
			})
			const data = this.verifyInfo()
			if(!data)
			{
				return
			}
			
			/* 获取签名 */
			getOssSignature()
			.then(signature => {
				uni.showLoading({
					title: "上传文件中...",
					mask: true
				})
				/* 上传证明材料 */
				let successAmount = 0
				data.prizeList.forEach((prize,i) => {
					/* 检测类型，仅支持jpg,jpeg,png */
					const temp = prize.testifyUrl.split(".")
					const filename = `${Date.now()}.${temp[temp.length-1]}`
					this.gUploadFile(prize.testifyUrl,filename,signature.data)
					.then(res => {
						/* 修改testifyUrl */
						prize.testifyUrl = res.url
						successAmount++
						if(successAmount === (data.prizeList.length + data.accessories.length))
						{
							this.publish(data)
						}
					})
					.catch(err => {
						this.gToastError("上传出现错误")
						console.log(err)
					})
				})
				
				/* 上传附件 */
				data.accessories.forEach((item,i) => {
					this.gUploadFile(item.url,item.name,signature.data)
					.then(res => {
						/* 修改url，指向对应地址 */
						item.url = res.url
						successAmount++
						if(successAmount === (data.prizeList.length + data.accessories.length))
						{
							this.publish(data)
						}
					})
					.catch(err => {
						this.gToastError("上传出现错误")
						console.log(err)
					})
				})
			})
			.catch(err => {
				console.log(err);
				this.gToastError("获取签名错误")
			})
		},
		/* 
			name: 发表资源
			desc: 上传证明和附件后向服务器提交表单
			input:
						data: Object,需要提交的数据
		*/
		publish(data)
		{
			uni.hideLoading()
			/* 请求服务器 */
			postResource(data)
			.then(res => {
				console.log(res);
				this.gToastSuccess("上传成功")
			})
			console.log(data)
		}
	},
	onLoad() {
		/* 判断用户是否签署合同，若为签署则跳转签署界面 */
		// if(!getApp().globalData.gUserInfo.signedContract)
		// {
		// 	uni.redirectTo({
		// 		url: "./Contract",
		// 		success: () => {
		// 			this.gToastError("请先签署合同")
		// 		}
		// 	})
		// }
	},
}
</script>

<style lang="stylus">
.up-resource
	position relative
	min-height 100vh
	padding 10rpx 30rpx
	input
		background-color var(--origin2)
		border-radius 10px
	/* 不同容器间共同样式 */
	.info
		margin 10px 0
		/* 提示文字 */
		.head
			font-weight 600
			color var(--origin4)
			display flex
			align-items center
		/* 图标 */
		.iconfont
			margin-left 10px
			font-size 42rpx
			font-weight 400
			color var(--origin4)
	/* 需要flex布局的容器 */
	.picker-content
		display grid
		grid-template-columns 1fr 1fr
		grid-gap 20rpx
		text-align center
		line-height 2
	/* 标签 */
	.tags .tag
		margin 5px
		padding 0 10px
		border var(--border1)
		border-radius 20px
		display inline-block
	/* 获奖 */
	.prizes .prize
		font-size 28rpx
		margin 10px 0
		.title
			margin-right 5px
			color var(--origin4)
		.search-input
			margin-bottom 10px
			padding 10px 5px
			background-color var(--origin2)			border-radius 10px 
		.classify
			margin 5px 0
			text-align center
			display flex
			align-items center
		.prize-grade
			position relative
			text-align center
			display flex
			align-items center
			.testify
				margin-left 10px
				color var(--origin4)
				display flex
				align-items center
				text
					margin-right 2px
			.remove
				position absolute
				right 0
	/* 作者信息 */
	.author .input
		display grid
		grid-template-columns 2fr 3fr
		grid-gap 10px
	/* 添加附件 */
	.files
		.remark
			font-size 28rpx
			color var(--gray)
		.list
			border 1px solid var(--origin4)
			border-radius 10px
			.file
				position relative
				padding 5px
				border-bottom 1px dotted var(--origin4)
				&:last-of-type
					border 0
				.file-info
					width calc(100% - 30px)
					white-space pre-wrap
					.size
						color var(--origin4)
						text-align end
				.remove
					position absolute
					top 50%
					transform translateY(-50%)
					right 5rpx
	/* 描述 */
	.description button
		color #FFFFFF
		background-color var(--button-bg)
	.edit-content
		z-index 20
		position fixed
		top 0
		left 0
		width 100%
		height 100%
		background-color #FFFFFF
	/* 上传资源 */
	.publish
		margin 10px auto
		background-color var(--button-bg)
		color #FFFFFF
</style>
