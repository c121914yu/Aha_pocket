<template>
	<!-- 专业技能 -->
	<view 
		class="card"
		:style="{
			'height': isProjectSkill ? 'auto' : '14px'
		}">
		<text
			class="fold iconfont icon-xiala"
			:style="{
				'transform': isProjectSkill ? 'rotate(0)' : 'rotate(180deg)'
			}"
			@click="isProjectSkill=!isProjectSkill">
		</text>
		<view class="h3">专业技能</view>
		<textarea 
			style="height: 300rpx;" 
			placeholder-style="font-size:24rpx"
			placeholder="IT技能: 前端开发,java……不同技能换行更美观!"
			hold-keyboard="true"
			v-model="projectSkill"/>
	</view>
</template>

<script>
export default {
	data() {
		const projectSkill = getApp().globalData.gResume.projectSkill || ""
		return {
			projectSkill, // 专业技能
			isProjectSkill: true
		}
	}
}
</script>

<style lang="stylus" scoped>
.h3
	margin-bottom 10px
</style>
