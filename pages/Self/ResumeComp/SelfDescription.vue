<template>
	<!-- 自我描述 -->
	<view 
		class="card"
		:style="{
			'height': isIntro ? 'auto' : '110rpx'
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
			v-model="intro"/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			intro: "",
			isIntro: true
		}
	},
	created() {
		/* 读取本地数据 */
		const story = JSON.parse(uni.getStorageSync("resume"))
		this.intro = story.intro
	}
}
</script>

