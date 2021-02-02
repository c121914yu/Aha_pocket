<template>
	<view class="honors">
		<resumeInput
			label="荣誉名称"
			placeholder="荣誉名称"
			v-model="name">
		</resumeInput>
		<resumeDataPicker
			label="获奖时间"
			placeholder="获奖时间"
			v-model="time">
		</resumeDataPicker>
		<resumeTextarea
			label="项目描述"
			placeholder="项目描述"
			v-model="description">
		</resumeTextarea>
		<view class="btns">
			<button v-if="index" class="delete" @click="remove">删除</button>
			<button class="save" @click="save">保存</button>
		</view>
	</view>
</template>

<script>
import { putResume } from '@/static/request/api_userInfo.js'
import resumeInput from "./Resume_input.vue"
import resumeDataPicker from "./Resume_datePicker"
import resumeTextarea from "./Resume_textarea.vue"
export default {
	data() {
		return {
			index: null,
			is_remove: false,
			name: "",
			description: "",
			time: "",
		};
	},
	components: {
		resumeInput,
		resumeDataPicker,
		resumeTextarea
	},
	onLoad(e) {
		if(e.index){
			this.index = e.index
			const resume = getApp().globalData.gResume.honors[e.index]
			for(let key in resume){
				this[key] = resume[key]
			}
		}
		console.log(getApp().globalData.gResume.honors);
	},
	beforeDestroy() {
		if(!this.is_remove){
			this.putExperience()
		}
	},
	methods: {
		save()
		{
			uni.navigateBack({
				delta: 1
			})
		},
		putExperience()
		{
			const data = {
				name: this.name,
				description: this.description,
				time: this.time,
			}
			if(this.index){
				getApp().globalData.gResume.honors[this.index] = data
			}
			else{
				if(getApp().globalData.gResume.honors){
					getApp().globalData.gResume.honors.push(data)
				}
				else{
					getApp().globalData.gResume.honors = [data]
				}
			}
			putResume(getApp().globalData.gResume)
		},
		/* 删除荣誉 */
		remove()
		{
			this.gShowModal("确认删除该经历？",() => {
				this.is_remove = true
				getApp().globalData.gResume.honors.splice(this.index,1)
				putResume(getApp().globalData.gResume)
				uni.navigateBack({
					delta: 1
				})
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.honors
	padding 10px 5% 55px
	/* 保存按键 */
	.btns
		z-index 5
		position fixed
		bottom 0
		left 0
		right 0
		background-color var(--origin2)
		padding 10px 10%
		border-top-left-radius 22px
		border-top-right-radius 22px
		display flex
		.delete
			margin-right 20px
			flex 1
			padding 3px
			background-color #F56C6C
		.save
			flex 4
			padding 3px
			background-color #FFFFFF
			color var(--origin2)
</style>
