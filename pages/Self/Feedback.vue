<template>
	<view class="feedback">
		<textarea 
			placeholder="写下您的意见或遇到的问题..." 
			maxlength="-1"
			auto-height	
			v-model="feedback"/>
		<button class="center">反馈</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			feedback: ""
		}
	}
}
</script>

<style lang="stylus" scoped>
.feedback
	padding 10px
	textarea
		width 100%
		min-height 80px
	button
		margin-top 10px
		width 100px
		padding 0
		border-radius 22px
</style>
