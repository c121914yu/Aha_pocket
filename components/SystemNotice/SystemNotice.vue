<!-- 系统公告 -->
<template>
	<view class="notice fix-screen">
		<view class="content">
			<view class="notice">
				<view class="center h3">{{notices[page].title}}</view>
				<view class="small time">{{notices[page].createTime}}</view>
				<view class="main" v-html="notices[page].content"></view>
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
	data(){
		return{
			page: 0
		}
	},
	created() {
		console.log(this.notices[0]);
	}
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
			.main
				min-height 150px
				max-height 500px
				overflow auto
		.sure
			width 100px
			padding 0
</style>
