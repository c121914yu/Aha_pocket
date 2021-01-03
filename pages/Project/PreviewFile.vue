<!-- 预览文档类型附件 -->
<template>
	<view class="read-file">
		<image
			v-if="url"
			class="file"
			v-for="(url,index) in urls"
			:key="index"
			:src="url"
			mode="widthFix"
			lazy-load
			@error="loadErr(index)"
			@click="preview(index)">
		</image>
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			urls: []
		}
	},
	onLoad(e) {
		for(let i=1;i<=5;i++){
			this.urls.push(`${e.url}${i}.jpg`)
		}
		console.log(this.urls)
	},
	methods: {
		loadErr(index)
		{
			this.urls[index] = null
			this.$forceUpdate()
		},
		preview(index)
		{
			uni.previewImage({
				urls: this.urls.filter(url => url !== null),
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
	.file
		width 100vw
</style>
