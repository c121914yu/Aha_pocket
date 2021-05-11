<!-- 
	个人介绍
	author yjl
 -->
<template>
	<view class="intro">
		<textarea 
			placeholder="个人总结"
			maxlength="1000"
			v-model="intro"/>
		<view class="count">
			{{intro.length || 0}} / 1000
		</view>
		<button @click="gBackPage('')">保存</button>
	</view>
</template>

<script>
import { putResume } from '@/static/request/api_userInfo.js'
export default {
	data() {
		return {
			intro: getApp().globalData.gResume.intro
		}
	},
	beforeDestroy() {
		this.putData()
	},
	methods: {
		/**
		 * 更新经历（追加也是更新）
		 */
		putData()
		{
			getApp().globalData.gResume.intro = this.intro
			putResume(getApp().globalData.gResume)
		}
	}
}
</script>

<style lang="stylus" scoped>
.intro
	padding 20px 10px
	textarea
		height 40vh
		width 100%
		padding-bottom 5px
		border-bottom var(--border2)
		border-radius 0
	.count
		margin 5px 0
		text-align end
		font-size 22rpx
		color var(--gray2)
	/* 保存按键 */
	button
		margin 10px auto
		background-color var(--origin2)
		color #FFFFFF
		border-radius 22px
</style>
