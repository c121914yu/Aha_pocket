<template>
	<view class="read-file">
		<image
			class="file"
			v-for="(url,index) in urls"
			:key="index"
			:src="url"
			mode="widthFix"
			lazy-load
			@longpress="viewImg(index)">
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
				@change="changePage"/>
			<text class="hyphen">/</text>
			<text class="max">{{maxPage}}</text>
		</view>
		<is_loading ref="is_loading"></is_loading>
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
			imgHeight: 0, //记录图片高度
			loadNum: 1, // 每次加载多少张图片
			maxPage: 5, // 文档最大页数
			is_loading: false, //是否加载中
			urls: []
		}
	},
	onLoad(e) {
		this.id = Number(e.id)
		this.getSignature()
	},
	// onReachBottom() {
	// 	if(!this.is_loading){
	// 		this.loadPage(2)
	// 	}
	// },
	/* 监听滚动,判断当前页是否加载 */
	// onPageScroll(e) {
	// 	this.currentPage = Math.round(e.scrollTop / this.imgHeight) + 1
	// 	/* 判断当前页是否加载,若没有加载则去加载它 */
	// 	if(!this.urls[this.currentPage-1] && !this.is_loading){
	// 		this.loadedPage = this.currentPage
	// 		this.loadPage(1)
	// 	}
	// },
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
				this.loadPage(1,1)
			})
			.catch(err => {
				console.error(err)
				this.gLoading(this,false)
			})
		},
		/* 
			第一次加载成功
			1. 获取屏幕高度
			2. 获取单张图片高度
			3. 计算3屏幕需要多少张图片
		*/
		firstLoad()
		{
			/* 获取DOM高度 */
			uni.createSelectorQuery().select(".file").boundingClientRect((data) => {
				this.imgHeight = data.height
				/* 获取系统高度 */
				const screenHeight = uni.getSystemInfoSync().screenHeight
				this.loadNum = Math.ceil(screenHeight*3 / this.imgHeight)
				this.loadPage(2,this.loadNum)
				console.log(this.imgHeight)
				this.gLoading(this,false)
			}).exec()
		},
		/* 
			加载界面
			@params loadMax: Number,每次加载的最大页码数
			@set this.urls: Array,图片路径
			time: 2021/1/3
		*/
		loadPage(startPage,endPage)
		{
			this.is_loading = true
			/* 页码限定 */
			if(startPage < 1) {
				startPage = 1
			}
			if(endPage > this.maxPage) {
				endPage = this.maxPage
			}
			/* 遍历加载 */
			for(let i=startPage;i<=endPage;i++) {
				/* 已经加载过，跳过 */
				if(this.urls[i-1]){
					continue
				}
				uni.request({
					url: `https://${this.signature.bucketName}.cos.${this.signature.region}.myqcloud.com${this.signature.filename}`,
					method: "GET",
					data: {
						"ci-process": "doc-preview",
						"page": i
					},
					header: {
						'Authorization': this.signature.authorization
					},
					responseType: "arraybuffer",
					success: (res) => {
						if(res.statusCode === 200){
							console.log(i)
							/* 二进制转base64,生成图片 */
							const url = 'data:image/png;base64,' + uni.arrayBufferToBase64(res.data)
							this.urls[i-1] = url
							this.$forceUpdate()
							/* 第一次请求，从响应头获取最大页码 */
							if(i === 1) {
								this.maxPage = Number(res.header["X-Total-Page"])
								this.$nextTick(this.firstLoad)
							}
						}
						else {
							this.gToastMsg("请求错误")
							this.gLoading(this,false)
						}
					},
					fail: (err) => {
						console.error(err)
						this.gToastMsg("请求错误")
						this.gLoading(this,false)
					}
				})
			}
		},
		/* 拖动选择页码 */
		changePage(e)
		{
			
		},
		/* 
			打开图片阅读器
			@params index: Number,点击页码
		*/
	    viewImg(index)
	    {
			uni.previewImage({
				urls: this.urls.filter(url => url),
				current: index
			})
	    }
	}
}
</script>

<style lang="stylus" scoped>
.read-file
	min-height 100vh
	overflow-x hidden
	padding-bottom 45px
	.file
		width 100vw
	.page-control
		position fixed
		bottom 0
		left 0
		right 0
		height 40px
		padding  0 20px
		background-color var(--origin3)
		border-top-left-radius 22px
		border-top-right-radius 22px
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
