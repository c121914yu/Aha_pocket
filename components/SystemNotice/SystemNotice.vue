<!-- 系统公告 -->
<template>
	<view class="notice fix-screen">
		<view class="content">
			<view 
				class="notice"
				v-for="(notice,index) in notices"
				:key="index">
				<view class="center h3">{{notice.title}}</view>
				<view>{{notice.content}}</view>
			</view>
			<button class="sure center" @click="$emit('close')">确认</button>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		notices: Array
	},
}
</script>

<style lang="stylus" scoped>
.notice
	.content
		width 90%
		box-shadow var(--shadow2)
		border-radius 8px
		.notice
			margin-bottom 10px
		.sure
			width 100px
			padding 0
</style>
