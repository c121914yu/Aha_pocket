<template>
	<view class="read-file">
		<image
			class="file"
			:style="{
				height: imgHeight ? `${imgHeight}px` : 'auto'
			}"
			v-for="(url,index) in urls"
			:key="index"
			:src="url"
			mode="widthFix"
			@longpress="viewImg(index)"
			@load="loadSuccess($event,index)"
			@error="tempUrls[index]=0">
		</image>
		<view class="page-control">
			<slider 
				class="current"
				min="1"
				:max="maxPage"
				:value="currentPage"
				activeColor="#f8b86b"
				backgroundColor="#FFFFFF"
				block-color="#956134"
				block-size="18"
				show-value
				@change="changePage"
				@error="loadCount"/>
			<text class="hyphen">/</text>
			<text class="max">{{maxPage}}</text>
		</view>
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getReadSignature } from '@/static/request/api_project.js'
export default {
	data() {
		return {
			id: null,
			signature: null,
			currentPage: 1,
			imgHeight: null, //记录图片高度
			loadNum: 1, // 每次加载多少张图片
			maxPage: 1, // 文档最大页数
			urls: [],
			tempUrls: [],
			movinng: false
		}
	},
	onLoad(e) {
		this.id = Number(e.id)
		this.getSignature()
	},
	/* 监听滚动,判断当前页是否加载 */
	onPageScroll(e) {
		if(!this.movinng){
			/* 计算当前页 */
			this.currentPage = Math.round((e.scrollTop - this.imgHeight*0.3) / this.imgHeight) + 1
			this.loadCurrentPage()
		}
	},
	methods: {
		/* 
			获取签名
			@set this.signature: Object,签名
			timne: 2021/1/3
		*/
		getSignature()
		{
			this.gLoading(this,true)
			getReadSignature(this.id)
			.then(res => {
				this.signature = res.data
				this.loadPage(1)
			})
			.catch(err => {
				console.error(err)
				this.gLoading(this,false)
			})
		},
		/* 图片加载成功 */
		loadSuccess(e,index)
		{
			/* 第一次加载 */
			if(index === 0){
				/* 获取屏幕宽高 */
				const screenHeight = uni.getSystemInfoSync().screenHeight
				const screenWidth = uni.getSystemInfoSync().screenWidth
				/* 计算图片标签的高度，标签高度（屏幕） = 屏幕宽度/图片宽度 * 图片高度 */
				this.imgHeight = screenWidth / e.detail.width * e.detail.height 
				/* 获取3屏需要多少张图片 */
				this.loadNum = Math.round(screenHeight*3 / this.imgHeight)
				this.loadCurrentPage()
			}
		},
		/* 根据currentPage加载周围的图片 */
		loadCurrentPage()
		{
			const half = Math.floor(this.loadNum/2)
			let start = this.currentPage - half
			if(start < 1){
				start = 1
			}
			let end = start + this.loadNum
			if(end > this.maxPage){
				end = this.maxPage
			}
			for(let i=start;i<=end;i++){
				this.loadPage(i)
			}
		},
		/* 
			加载界面
			@params loadMax: Number,每次加载的最大页码数
			@set this.urls: Array,图片路径
			time: 2021/1/3
		*/
		loadPage(page)
		{
			/* 已经加载过，跳过 */
			if(this.tempUrls[page-1]){
				return
			}
			this.tempUrls[page-1] = 1
			uni.request({
				url: `https://${this.signature.bucketName}.cos.${this.signature.region}.myqcloud.com${this.signature.filename}`,
				method: "GET",
				data: {
					"ci-process": "doc-preview",
					"page": page
				},
				header: {
					'Authorization': this.signature.authorization
				},
				responseType: "arraybuffer",
				success: (res) => {
					if(res.statusCode === 200){
						console.log("加载第: " + page)
						/* 第一次请求，从响应头获取最大页码 */
						if(page === 1) {
							this.maxPage = Number(res.header["X-Total-Page"])
						}
						/* 二进制转base64,生成图片 */
						const url = 'data:image/png;base64,' + uni.arrayBufferToBase64(res.data)
						this.urls[page-1] = url
						this.$forceUpdate()
					}
					else {
						this.tempUrls[page-1] = 0
						console.log(res);
						this.gToastMsg("请求错误")
					}
				},
				fail: (err) => {
					this.tempUrls[page-1] = 0
					console.error(err)
					this.gToastMsg("请求错误")
				},
				complete: () => {
					this.gLoading(this,false)
				}
			})
		},
		/* 拖动选择页码 */
		changePage(e)
		{
			this.movinng = true
			this.gLoading(this,true)
			this.$nextTick(() => {
				this.currentPage = e.detail.value
				if(!this.urls[this.currentPage-1]){
					this.urls[this.currentPage-1] = null
				}
				this.loadCurrentPage()
				this.$nextTick(() => {
					uni.pageScrollTo({
						duration:0,
						scrollTop: (this.currentPage-1)*this.imgHeight + this.imgHeight*0.5,
						complete: () => {
							this.movinng = false
							this.gLoading(this,false)
						}
					})
				})
			})
		},
		/* 
			打开图片阅读器
			@params index: Number,点击页码
		*/
	    
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

