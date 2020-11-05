<!-- 资源分享 -->
<template>
	<view class="up-resource">
		<view class="content">
			<view class="h3">资源信息</view>
			<inputInfo 
				title="标题"
				contentWidth="80%"
				v-model="title">
			</inputInfo>
			<inputInfo
				title="作者"
				contentWidth="200rpx"
				v-model="authorName">
			</inputInfo>
			<inputInfo
				title="联系方式"
				v-model="authorContact">
			</inputInfo>
			<inputInfo
				title="完成程度"
				type="select"
				contentWidth="350rpx"
				:range="finishRates"
				v-model="finishRate">
			</inputInfo>
			<inputInfo
				title="资源类型"
				type="select"
				contentWidth="350rpx"
				:range="AccessoriesClassify"
				v-model="classify">
			</inputInfo>
			<inputInfo
				title="标签"
				contentWidth="80%"
				remark="(注: 不同标签用空格隔开)"
				v-model="tagText">
			</inputInfo>
			<view class="tags">
				<view 
					class="tag"
					v-for="(tag,index) in tags"
					:key="index">
					{{tag}}
				</view>
			</view>
		
			<!-- 获奖情况 -->
			<view class="input-info">
				<view class="h4">获奖情况:</view>
				<view class="prize">
					<view class="left">
						<view class="name">比赛名称</view>
						<view class="date">获奖日期</view>
						<view class="level">获奖等级</view>
					</view>
					<view class="right">
						<text class="add iconfont icon-tianjia"></text>
					</view>
				</view>
			</view>
			<!-- 附件列表 -->
			<view class="input-info">
				<view class="h4">附件列表:</view>
				<view class="accessories">
					<text class="iconfont icon-tianjia" @click="chooseFile"></text>
				</view>
				<view class="remark">(注:手机选择文件可从文件助手或聊天记录中选取，超过25M文件请用电脑选取。)</view>
			</view>
			<!-- 资源描述 -->
			<view class="h4">资源描述:</view>
		</view>
	</view>
</template>

<script>
import { getOssSignature,postResource } from "@/static/request/api_resource.js"
import inputInfo from "./components/inputInfo.vue"
export default {
	data() {
		const AccessoriesClassify = getApp().globalData.AccessoriesClassify
		const MatchName = getApp().globalData.MatchName
		const prizeGrades = getApp().globalData.prizeGrades
		return {
			title: "",
			authorName: "", // 作者名称
			authorContact: "", // 作者联系方式
			finishRate: "",
			classify: "",
			tagText: "",
			prizeList: [], // 获奖情况
			descriptionHTML: "",
			descriptionMD: "",
			accessories: [], // 附件
			finishRates: ["100%","80%-100%","50%-80%","0%-50%"], // 完成度数组
			AccessoriesClassify, // 资源类型
			MatchName,
			prizeGrades,
			isEdit: false
		}
	},
	computed: {
		/*
			desc: 监听输入标签内容改变，根据空格分隔
			input: 
						tagText: String,标签输入框内容
			return: null
			time: 2020/11/5
		*/
		tags()
		{
			return this.tagText.split(" ").filter(tag => tag !== "")
		},
	},
	methods: {
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
	components: {
		inputInfo
	}
}
</script>

<style lang="stylus">
.up-resource
	position relative
	min-height 100vh
	padding 20rpx
	background-color var(--origin3)
	.content
		padding 20rpx 60rpx
		background-color #FFFFFF
		border-radius 44rpx
		/* 大标题 */
		.h3
			padding 20rpx 0
			color var(--origin1)
		/* 小标题 */
		.h4
			color var(--origin1)
		/* 输入框 */
		.input-info
			margin 15rpx 0
		/* 标签框 */
		.tags
			width 100%
			display flex
			flex-wrap wrap
			.tag
				margin 0 5px 5px 0
				padding 0 10rpx
				border 1px solid var(--origin2)
				border-radius 20rpx
		/* 备注信息 */
		.remark
			color var(--origin2)
			font-size 20rpx
		/* 资源列表 */
		.accessories
			position relative
			width 100%
			min-height 100px
			padding 15rpx
			background-color var(--origin3)
			border-radius 20rpx
			.iconfont
				position absolute
				top 50%
				left 50%
				transform translate(-50%,-50%)
				color var(--origin2)
				font-size 40rpx
				font-weight 600
		/* 获奖列表 */
		.prize
			background-color var(--origin2)
			border-radius 10px
			display flex
			.left
				flex 1
				padding 10px
				background-color var(--origin3)
				border-radius 10px
				display flex
				flex-wrap wrap
				view
					padding 5px 0
					background-color #FFFFFF
					color var(--origin2)
					border-radius 22px
					text-align center
					font-size 24rpx
				.name
					width 100%
				.date
					margin 10px 10px 0 0
					flex 1
				.level
					margin-top 10px
					flex 1
			.right
				width 50px
				display flex
				flex-direction column
				align-items center
				justify-content space-around
				.iconfont
					font-size 40rpx
					font-weight 600
					border-radius 50%
					&.add
						color var(--origin1)
</style>
