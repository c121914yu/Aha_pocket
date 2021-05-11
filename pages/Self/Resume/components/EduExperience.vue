<!-- 
	教育经历
	author yjl
 -->
<template>
	<view v-if="is_loaded" class="edu-experience">
		<!-- 学位 -->
		<resume-menu-picker
			label="学位"
			:arr_range="['博士后','博士','硕士','本科','专科','高中']"
			placeholder="学位情况"
			v-model="degree">
		</resume-menu-picker>
		<!-- 学校 -->
		<resume-input
			label="学校"
			placeholder="你的学校"
			:arr_search="arr_school"
			v-model="school">
		</resume-input>
		<!-- 专业 -->
		<resume-input
			label="专业"
			placeholder="你的专业"
			v-model="specialty">
		</resume-input>
		<!-- 成绩 -->
		<resume-menu-picker
			label="成绩排名"
			:arr_range="arr_grade"
			placeholder="成绩排名"
			v-model="grade">
		</resume-menu-picker>
		<view class="border"></view>
		<resume-data-picker
			label="入学时间"
			placeholder="入学时间"
			v-model="startTime">
		</resume-data-picker>
		<resume-data-picker
			label="毕业时间"
			placeholder="毕业时间"
			is_today
			v-model="endTime">
		</resume-data-picker>
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
import resumeMenuPicker from "./Resume_menuPicker.vue"
export default {
	components: {
		"resume-input": resumeInput,
		"resume-data-picker": resumeDataPicker,
		"resume-menu-picker": resumeMenuPicker,
	},
	data() {
		return {
			is_loaded: false,
			is_remove: false, // 是否是删除该经历
			index: null, // 经历的下标
			degree: "",
			school: "",
			specialty: "",
			grade: "",
			startTime: "",
			endTime: "",
			arr_school: ['浙江工业大学', '杭州电子科技大学', '浙江大学', '杭州师范大学'],
			arr_grade: ['前1%', '1%-5%', '5%-20%', '20%-50%', '50%-100%'], // 成绩等级
		};
	},
	onLoad(e) {
		if(e.index){
			this.index = e.index
			const resume = getApp().globalData.gResume.eduExperiences[e.index]
			for(let key in resume){
				this[key] = resume[key]
			}
		}
		this.is_loaded = true
		console.log(getApp().globalData.gResume.eduExperiences);
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
				degree: this.degree,
				school: this.school,
				specialty: this.specialty,
				grade: this.grade,
				startTime: this.startTime,
				endTime: this.endTime,
			}
			/* 修改经历 */
			if(this.index !== null){
				getApp().globalData.gResume.eduExperiences[this.index] = data
			}
			/* 添加经历，判断是否为null */
			else{
				if(getApp().globalData.gResume.eduExperiences !== null){
					getApp().globalData.gResume.eduExperiences.push(data)
				}
				else{
					getApp().globalData.gResume.eduExperiences = [data]
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
				getApp().globalData.gResume.eduExperiences.splice(this.index,1)
				putResume(getApp().globalData.gResume)
				this.gBackPage("")
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.edu-experience
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
