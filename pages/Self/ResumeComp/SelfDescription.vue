<template>
	<!-- 自我描述 -->
	<view class="card">
		<view class="h3">自我描述</view>
		<textarea 
			style="height: 300rpx;" 
			placeholder-class="placeholderStyle"
			v-model="selfDescription"/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selfDescription: ""
		}
	},
}
</script>

