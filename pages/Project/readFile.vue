<template>
	<view class="read-file">
		<image
			class="file"
			v-for="(url,index) in urls"
			:key="index"
			:src="url"
			mode="widthFix"
			lazy-load>
		</image>
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getReadSignature } from '@/static/request/api_project.js'
export default {
	data() {
		return {
			id: null,
			signature: null,
			page: 1,
			loadNum: 0, // 加载到第几页
			loadMax: 2, // 每次加载3页
			isloadAll: false,
			urls: []
		}
	},
	onLoad(e) {
		this.id = Number(e.id)
		this.loadPage(true)
	},
	onReachBottom() {
		this.loadPage()
	},
	methods: {
		/* 获取签名 */
		getSignature()
		{
			getReadSignature(this.id)
			.then(res => {
				this.signature = res.data
				this.loadPage()
			})
			.catch(err => {
				console.error(err)
				this.gLoading(this,false)
			})
		},
		loadPage(loading=false)
		{
			if(this.isloadAll){
				return
			}
			this.gLoading(this,loading)
			if(!this.signature){
				this.getSignature()
				return
			}
			uni.request({
				url: `https://${this.signature.bucketName}.cos.${this.signature.region}.myqcloud.com${this.signature.filename}`,
				method: "GET",
				data: {
					"ci-process": "doc-preview",
					"page": this.page
				},
				header: {
					'Authorization': this.signature.authorization
				},
				responseType: "arraybuffer",
				success: (res) => {
					if(res.statusCode !== 200){
						if(loading){
							this.gToastMsg("页码超出范围")
						}
						this.isloadAll = true
					}
					else{
						/* 二进制转base64 */
						const url = 'data:image/png;base64,' + uni.arrayBufferToBase64(res.data)
						this.urls[this.page-1] = url
						this.page++
						this.loadNum++
						console.log(this.page)
						if(this.loadNum < this.loadMax){
							this.loadPage()
						}
						else{
							this.loadNum = 0
						}
					}
				},
				fail: (err) => {
					console.error(err)
				},
				complete: () => {
					this.gLoading(this,false)
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.read-file
	min-height 100vh
	overflow-x hidden
	.file
		width 100vw
</style>
