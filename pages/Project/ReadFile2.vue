<!-- 
	文档转HTML阅读器
	author yjl
 -->
<template>
	<view class="read-file">
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getReadSignature,getLoadSignature } from '@/static/request/api_project.js'
// import COSDocPreviewSDK from "@/static/js/filePreview.js"
export default {
	data() {
		return {
			url: ""
		}
	},
	onLoad(e) {
		this.gLoading(this,true)
		console.log(e);
		getLoadSignature(Number(e.id))
		.then(res => {
			return res.data
		})
		.then(sign => {
			return new Promise((resolve,reject) => {
				/* 请求html */
				uni.request({
					// filename自带/不需要再写一个
					url: `https://${sign.bucketName}.cos.${sign.region}.myqcloud.com${sign.filename}`,
					data: {
						"ci-process": "doc-preview",
						"dstType": "html",
						"sign": sign.authorization,
						"copyable": "0", // 不可复制
						"weboffice_url": "1"
					},
					success: (res) => {
						resolve(res)
					},
					fail: (err) => {
						reject(err)
					}
				})
			})
		})
		.then(res => {
			this.url = res.data.PreviewUrl
			console.log(this.url);
			console.log(COSDocPreviewSDK);
		})
		.catch(err => {
			console.log(err)
			this.gBackPage("阅读器错误")
		})
		.finally(() => this.gLoading(this,false))
	},
	methods: {
		/**
		 * 点击复制链接
		 */
		oncopy()
		{
			this.gClipboardData(this.url,"已复制阅读地址! ")
		}
	}
}
</script>

<style lang="stylus" scoped>
.read-file
	min-height 100vh
	overflow-x hidden
	padding-top 45px
	.file
		width 100vw
	.page-control
		position fixed
		top 0
		left 0
		right 0
		height 35px
		padding 0 20px
		background-color var(--origin3)
		border-bottom-left-radius 22px
		border-bottom-right-radius 22px
		display flex
		align-items center
		.current
			margin 0
			flex 1
		.hyphen
			margin 0 5px
		.max
			font-size 26rpx
			color #FFFFFF
</style>

