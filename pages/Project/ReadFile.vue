<!-- 文件预览 -->
<template>
	<view class="read-file">
		<view class="loading" v-if="progress < 100">
			<progress
				:percent="progress" 
				show-info 
				border-radius="20"
				stroke-width="20"
				activeColor="#f8b86b"
				backgroundColor="#FFFFFF"
				active-mode="forwards"
				active="true"/>
			<button loading>下载中</button>
		</view>
		<view class="content" v-else>
			<image v-if="imgUrl" :src="imgUrl" mode="widthFix"></image>
			<view v-else>
				<view class="h3 center">即将打开文件...请及时保存</view>
				<button @click="openFile">手动打开</button>
			</view>
		</view>
	</view>
</template>

<script>
import { getLoadSignature } from "@/static/request/api_project.js"
export default {
	data() {
		return {
			imgUrl: "",
			progress: 0,
			filePath: ""
		}
	},
	methods: {
		/* 下载文件 */
		loadFile(e)
		{
			getLoadSignature(e.id)
			.then(res => {
				const downloadTask = uni.downloadFile({
					url: res.data.url,
					success: (file) => {
						/* 判断是否为图片 */
						const type = file.header["Content-Type"]
						let reg = /image/i
						if(reg.test(type)){
							this.imgUrl = file.tempFilePath
						}
						else{
							this.filePath = file.tempFilePath
							this.openFile()
						}
					}
				})
				downloadTask.onProgressUpdate((progress) => {
					this.progress = progress.progress
				})
			})
		},
		/* 打开文件 */
		openFile(url)
		{
			uni.openDocument({
				filePath: this.filePath
			})
		}
	},
	onLoad(e) {
		this.loadFile(e)
	}
}
</script>

<style lang="stylus" scoped>
.read-file
	min-height 100vh
	background-color var(--white1)
	.loading
		padding 5%
		button
			margin 10px 0
			background-color var(--gray2)
			&:active
				transform none
	.content
		padding 5% 0
		image
			width 100%
		button
			margin 10px 5%
</style>
