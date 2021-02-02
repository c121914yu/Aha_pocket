<template>
	<view class="project-experience">
		<resumeInput
			label="项目名称"
			placeholder="项目名称"
			v-model="name">
		</resumeInput>
		<resumeInput
			label="负责内容"
			placeholder="你负责的内容"
			v-model="content">
		</resumeInput>
		<resumeDataPicker
			label="开始时间"
			placeholder="开始时间"
			v-model="startTime">
		</resumeDataPicker>
		<resumeDataPicker
			label="结束时间"
			placeholder="结束时间"
			v-model="endTime">
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
			content: "",
			description: "",
			startTime: "",
			endTime: "",
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
			const resume = getApp().globalData.gResume.projectExperiences[e.index]
			for(let key in resume){
				this[key] = resume[key]
			}
		}
		console.log(getApp().globalData.gResume.projectExperiences);
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
				content: this.content,
				description: this.description,
				startTime: this.startTime,
				endTime: this.endTime,
			}
			if(this.index){
				getApp().globalData.gResume.projectExperiences[this.index] = data
			}
			else{
				if(getApp().globalData.gResume.projectExperiences){
					getApp().globalData.gResume.projectExperiences.push(data)
				}
				else{
					getApp().globalData.gResume.projectExperiences = [data]
				}
			}
			putResume(getApp().globalData.gResume)
		},
		/* 删除经历 */
		remove()
		{
			this.gShowModal("确认删除该经历？",() => {
				this.is_remove = true
				getApp().globalData.gResume.projectExperiences.splice(this.index,1)
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
.project-experience
	padding 10px 5% 55px
	.border
		margin 5px 0
		width 100%
		height 1px
		background-color var(--white1)
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
