<!-- 
	个人荣誉
	author yjl
 -->
<template>
	<view v-if="is_loaded" class="honors">
		<resume-input
			label="荣誉名称"
			placeholder="荣誉名称"
			v-model="name">
		</resume-input>
		<resume-data-picker
			label="获奖时间"
			placeholder="获奖时间"
			:endTime="gGetToday()"
			v-model="time">
		</resume-data-picker>
		<resume-textarea
			label="荣誉描述"
			placeholder="荣誉描述"
			v-model="description">
		</resume-textarea>
		<view class="btns">
			<button v-if="index!==null" class="delete" @click="onclickRemoveHonors">删除</button>
			<button class="save" @click="onclickSave">{{index === null ? "创建成就" : "保存"}}</button>
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
			is_remove: false,
			index: null,
			name: "",
			description: "",
			time: "",
		};
	},
	onLoad(e) {
		if(e.index){
			this.index = e.index
			const resume = getApp().globalData.gResume.honors[e.index]
			for(let key in resume){
				this[key] = resume[key]
			}
		}
		this.is_loaded = true
		console.log(getApp().globalData.gResume.honors);
	},
	beforeDestroy() {
		/* 创建简历 | 删除简历时不触发更新 */
		if(this.index!== null && !this.is_remove){
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
		/**
		 * 删除成就
		 */
		onclickRemoveHonors()
		{
			this.gShowModal("确认删除该成就？",() => {
				this.is_remove = true
				getApp().globalData.gResume.honors.splice(this.index,1)
				putResume(getApp().globalData.gResume)
				this.gBackPage("")
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
