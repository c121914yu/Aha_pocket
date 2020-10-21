<template>
	<!-- 专业技能 -->
	<view class="card">
		<view class="h3">专业技能</view>
		<textarea 
			style="height: 300rpx;" 
			placeholder="IT技能: 前端开发,java……不同技能换行更美观!"
			placeholder-class="placeholderStyle"
			v-model="proSkill"/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			proSkill: "", // 专业技能
		}
	}
}
</script>

<style lang="stylus" scoped>

</style>
