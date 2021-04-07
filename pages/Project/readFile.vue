<template>
	<view class="read-file">
		<image
			v-once
			:id="index"
			class="file"
			:style="{
				height: `${imgHeight}px`
			}"
			v-for="(img, index) in images"
			:key="img.page"
			:src="img.url"
			mode="widthFix"
			@load="loadSuccess($event, img.page)"
			@longpress="viewImg(index)"
		></image>
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
			<text class="max">{{ maxPage }}</text>
		</view>
		<Loading ref="loading"></Loading>
	</view>
</template>

<!-- 
	1. 获取签名
	2. 先预加载一次，获得maxPage ，imgHeight,loadNum
	3. 第一次加载完成后主动调用一次加载当前页
	4. page-1对应数组的index，需要加载某一页时先创建对应index的图片，再请求图片
-->
<script>
import { getReadSignature } from '@/static/request/api_project.js';
export default {
	data() {
		return {
			signature: null,
			imgHeight: 50,
			images: [],
			loadNum: 1, // 每次加载2loadNum + 1张图片
			maxPage: 1, // 最大页码数
			currentPage: 1, // 当前页码数
			loading: false,
			is_scrollTo: false //是否滚动到指定页
		};
	},
	onLoad(e) {
		getReadSignature(e.id).then(res => {
			this.signature = res.data;
			/* 第一次加载 */
			this.loadFirst();
		});
	},
	/* 监听滚动,判断当前页是否加载 */
	onPageScroll(e) {
		if (!this.loading) {
			this.currentPage = Math.round(e.scrollTop / this.imgHeight) + 1;
			this.loadCurrent();
		}
	},
	methods: {
		/* 第一次加载图片加载成功 */
		loadSuccess(e, page) 
		{
			if (page === 1) {
				/* 获取屏幕宽高 */
				const screenHeight = uni.getSystemInfoSync().screenHeight;
				const screenWidth = uni.getSystemInfoSync().screenWidth;
				/* 计算图片标签的高度，标签高度（屏幕） = 屏幕宽度/图片宽度 * 图片高度 */
				this.imgHeight = (screenWidth / e.detail.width) * e.detail.height;
				/* 获取3屏需要多少张图片 */
				this.loadNum = Math.round((screenHeight * 3) / this.imgHeight / 2);
				this.loadCurrent();
			}
			if(this.is_scrollTo){
				uni.pageScrollTo({
					duration:0,
					scrollTop: (this.currentPage-1)*this.imgHeight + this.imgHeight,
					complete: () => {
						this.is_scrollTo = false
						this.gLoading(this,false)
					}
				})
			}
		},
		/* 加载图片 */
		loadCurrent() 
		{
			this.loading = true;
			/* 获取当前页 */
			const pages = [];
			for (let i = this.currentPage - this.loadNum; i <= this.currentPage + this.loadNum; i++) {
				if (i > 1 && i <= this.maxPage && !this.images[i - 1]) {
					pages.push(i);
				}
			}
			if (pages.length === 0) {
				this.loading = false;
				return;
			}
			Promise.all(pages.map(item => this.loadPage(item)))
				.then(res => {
					// console.log(this.images);
					this.loading = false;
				})
				.catch(err => {
					this.loading = false;
				});
		},
		/* 拖动改变page */
		changePage(e) 
		{
			this.gLoading(this, true)
			this.is_scrollTo = true
			this.currentPage = e.detail.value
			this.loadCurrent()
		},
		loadFirst() 
		{
			this.gLoading(this, true);
			this.images.push({ page: 1, url: '' });
			uni.request({
				url: `https://${this.signature.bucketName}.cos.${this.signature.region}.myqcloud.com${this.signature.filename}`,
				method: 'GET',
				data: {
					'ci-process': 'doc-preview',
					page: 1
				},
				header: {
					Authorization: this.signature.authorization
				},
				responseType: 'arraybuffer',
				success: res => {
					if (res.statusCode === 200) {
						console.log('加载第: ' + 1);
						this.maxPage = Number(res.header['X-Total-Page']);
						/* 二进制转base64,生成图片 */
						this.images[0].url = 'data:image/png;base64,' + uni.arrayBufferToBase64(res.data);
					} else {
						console.log(res);
						this.gToastMsg('请求错误');
					}
				},
				fail: err => {
					console.error(err);
					this.gToastMsg('请求错误');
				},
				complete: () => {
					this.gLoading(this, false);
				}
			});
		},
		loadPage(page) 
		{
			return new Promise((resolve, reject) => {
				/* 从后往前搜索，找到第一个比page要小的已加载的页,并插入数据 */
				this.images[page - 1] = { page, url: '' };
				uni.request({
					url: `https://${this.signature.bucketName}.cos.${this.signature.region}.myqcloud.com${this.signature.filename}`,
					method: 'GET',
					data: {
						'ci-process': 'doc-preview',
						page: page
					},
					header: {
						Authorization: this.signature.authorization
					},
					responseType: 'arraybuffer',
					success: res => {
						if (res.statusCode === 200) {
							console.log('加载第: ' + page);
							/* 二进制转base64,生成图片 */
							this.images[page - 1].url = 'data:image/png;base64,' + uni.arrayBufferToBase64(res.data);
							resolve(page);
						} else {
							console.log(res);
							this.gToastMsg('请求错误');
							reject(false);
						}
					},
					fail: err => {
						console.error(err);
						this.gToastMsg('请求错误');
						reject(false);
					}
				});
			})
		},
		viewImg(index)
		{
			uni.previewImage({
				urls: this.images.filter(img => img).map(img => img.url),
				current: index
			})
		}
	}
};
</script>

<style lang="stylus" scoped>
.read-file
	position relative
	min-height 100vh
	overflow-x hidden
	overflow-y auto
	padding-top 45px
	.mask
		width 100%
	.file
		width 100%
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
