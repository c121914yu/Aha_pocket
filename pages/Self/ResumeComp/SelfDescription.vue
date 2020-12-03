<template>
	<!-- 自我描述 -->
	<view 
		class="card"
		:style="{
			'height': isIntro ? 'auto' : '50px'
		}">
		<text
			class="fold iconfont icon-xiala"
			:style="{
				'transform': isIntro ? 'rotate(0)' : 'rotate(180deg)'
			}"
			@click="isIntro=!isIntro">
		</text>
		<view class="h3">自我描述</view>
		<textarea 
			style="height: 300rpx;" 
			placeholder-class="placeholderStyle"
			hold-keyboard="true"
			v-model="intro"/>
	</view>
</template>

<script>
export default {
	data() {
		const intro = getApp().globalData.gResume.intro || ""
		return {
			intro,
			isIntro: true
		}
	}
}
</script>

<style lang="stylus" scoped>
.h3
	margin-bottom 10px
</style>
