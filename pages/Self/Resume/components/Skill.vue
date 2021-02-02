<template>
	<view class="skill">
		<textarea 
			placeholder="个人技能描述"
			maxlength="1000"
			@input="inputing"
			v-model="projectSkill"/>
		<view class="count">
			{{projectSkill.length || 0}} / 1000
		</view>
		<button @click="save">保存</button>
	</view>
</template>

<script>
import { putResume } from '@/static/request/api_userInfo.js'
export default {
	data() {
		return {
			projectSkill: getApp().globalData.gResume.projectSkill
		}
	},
	beforeDestroy() {
		this.putData()
	},
	methods: {
		save()
		{
			uni.navigateBack({
				delta: 1
			})
		},
		putData()
		{
			getApp().globalData.gResume.projectSkill = this.projectSkill
			putResume(getApp().globalData.gResume)
		}
	}
}
</script>

<style lang="stylus" scoped>
.skill
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
