<template>
	<view>
		<web-view 
			v-if="url" 
			:src="url"
			@bindload="linkSuccess"
			@binderror="linkErr">
		</web-view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
export default {
	data(){
		return {
			url: null
		}
	},
	onLoad(e) {
		this.gLoading(this,true)
		this.url = e.url
	},
	methods: {
		/**
		 * 加载成功，关闭动画
		 */
		linkSuccess()
		{
			this.gLoading(this,false)
		},
		/**
		 * 加载失败
		 */
		linkErr()
		{
			this.gToastError("连接错误")
			setTimeout(() => {
				uni.navigateBack({
					delta: 1
				})
			},1000)
		}
	}
}
</script>

<style lang="stylus">

</style>
