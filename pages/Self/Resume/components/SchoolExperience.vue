<template>
	<view v-if="loaded" class="school-experience">
		<resumeInput
			label="社团名称"
			placeholder="社团名称"
			v-model="organization">
		</resumeInput>
		<resumeInput
			label="职位"
			placeholder="相关职位"
			v-model="post">
		</resumeInput>
		<resumeDataPicker
			label="开始时间"
			placeholder="开始时间"
			v-model="startTime">
		</resumeDataPicker>
		<resumeDataPicker
			label="结束时间"
			placeholder="结束时间"
			is_today
			v-model="endTime">
		</resumeDataPicker>
		<resumeTextarea
			label="任职描述"
			placeholder="描述"
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
			loaded: false,
			index: null,
			is_remove: false,
			organization: "",
			post: "",
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
			const resume = getApp().globalData.gResume.schoolExperiences[e.index]
			for(let key in resume){
				this[key] = resume[key]
			}
		}
		this.loaded = true
		console.log(getApp().globalData.gResume.schoolExperiences);
	},
	beforeDestroy() {
		/* 新简历返回 | 删除时不触发 */
		if(this.index !== null && !this.is_remove){
			this.putExperience()
		}
	},
	methods: {
		save()
		{
			/* 新简历点击保存时手动触发更新 */
			if(this.index === null){
				this.putExperience()
			}
			uni.navigateBack({
				delta: 1
			})
		},
		putExperience()
		{
			const data = {
				organization: this.organization,
				post: this.post,
				description: this.description,
				startTime: this.startTime,
				endTime: this.endTime,
			}
			if(this.index){
				getApp().globalData.gResume.schoolExperiences[this.index] = data
			}
			else{
				if(getApp().globalData.gResume.schoolExperiences){
					getApp().globalData.gResume.schoolExperiences.push(data)
				}
				else{
					getApp().globalData.gResume.schoolExperiences = [data]
				}
			}
			
			putResume(getApp().globalData.gResume)
		},
		/* 删除经历 */
		remove()
		{
			this.gShowModal("确认删除该经历？",() => {
				this.is_remove = true
				getApp().globalData.gResume.schoolExperiences.splice(this.index,1)
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
.school-experience
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
