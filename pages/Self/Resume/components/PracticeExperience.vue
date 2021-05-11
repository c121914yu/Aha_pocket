<!-- 
	实习经历
	author yjl
 -->
<template>
	<view v-if="is_loaded" class="practice-experience">
		<resume-input
			label="企业名称"
			placeholder="实习企业名称"
			v-model="company">
		</resume-input>
		<resume-input
			label="实习职位"
			placeholder="实习职位"
			v-model="post">
		</resume-input>
		<resume-data-picker
			label="开始时间"
			placeholder="开始时间"
			v-model="startTime">
		</resume-data-picker>
		<resume-data-picker
			label="结束时间"
			placeholder="结束时间"
			is_today
			v-model="endTime">
		</resume-data-picker>
		<resume-textarea
			label="工作描述"
			placeholder="工作描述"
			v-model="description">
		</resume-textarea>
		<view class="btns">
			<button v-if="index!==null" class="delete" @click="onclickRemoveExp">删除</button>
			<button class="save" @click="onclickSave">{{index === null ? "创建经历" : "保存"}}</button>
		</view>
	</view>
</template>

<script>
import { putResume } from '@/static/request/api_userInfo.js'
import resumeInput from "./Resume_input.vue"
import resumeDataPicker from "./Resume_datePicker"
import resumeTextarea from "./Resume_textarea.vue"
export default {
	components: {
		"resume-input": resumeInput,
		"resume-data-picker": resumeDataPicker,
		"resume-textarea": resumeTextarea,
	},
	data() {
		return {
			is_loaded: false,
			index: null,
			is_remove: false,
			company: "",
			post: "",
			description: "",
			startTime: "",
			endTime: "",
		};
	},
	onLoad(e) {
		if(e.index){
			this.index = e.index
			const resume = getApp().globalData.gResume.practiceExperiences[e.index]
			for(let key in resume){
				this[key] = resume[key]
			}
		}
		this.is_loaded = true
		console.log(getApp().globalData.gResume.practiceExperiences);
	},
	beforeDestroy() {
		/* 创建简历 | 删除简历时不触发更新 */
		if(this.index !== null && !this.is_remove){
			this.putExperience()
		}
	},
	methods: {
		/**
		 * 点击保存按键，判断是创建还是修改，如果是创建经历则调用API添加经历。
		 */
		onclickSave()
		{
			/* 新简历点击保存时手动触发更新 */
			if(this.index === null){
				this.putExperience()
			}
			this.gBackPage("")
		},
		/**
		 * 更新经历（追加也是更新）
		 */
		putExperience()
		{
			const data = {
				company: this.company,
				post: this.post,
				description: this.description,
				startTime: this.startTime,
				endTime: this.endTime,
			}
			if(this.index){
				getApp().globalData.gResume.practiceExperiences[this.index] = data
			}
			else{
				if(getApp().globalData.gResume.practiceExperiences){
					getApp().globalData.gResume.practiceExperiences.push(data)
				}
				else{
					getApp().globalData.gResume.practiceExperiences = [data]
				}
			}
			
			putResume(getApp().globalData.gResume)
		},
		/**
		 * 删除经历
		 */
		onclickRemoveExp()
		{
			this.gShowModal("确认删除该经历？",() => {
				this.is_remove = true
				getApp().globalData.gResume.practiceExperiences.splice(this.index,1)
				putResume(getApp().globalData.gResume)
				this.gBackPage("")
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.practice-experience
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
