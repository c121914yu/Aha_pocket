<template>
	<view>
		<web-view 
			v-if="url" 
			:src="url"
			@bindload="linkSuccess"
			@binderror="linkErr">
		</web-view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
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
		linkSuccess()
		{
			this.gLoading(this,false)
		},
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
