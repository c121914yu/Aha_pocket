<template>
	<view class="edu-experience">
		<!-- 学位 -->
		<resumeMenuPicker
			label="学位"
			:arr_range="['博士后','博士','硕士','本科','专科','高中']"
			placeholder="学位情况"
			v-model="degree">
		</resumeMenuPicker>
		<!-- 学校 -->
		<resumeInput
			label="学校"
			placeholder="你的学校"
			:arr_search="arr_school"
			v-model="school">
		</resumeInput>
		<!-- 专业 -->
		<resumeInput
			label="专业"
			placeholder="你的专业"
			v-model="specialty">
		</resumeInput>
		<!-- 成绩 -->
		<resumeMenuPicker
			label="成绩排名"
			:arr_range="arr_grade"
			placeholder="成绩排名"
			v-model="grade">
		</resumeMenuPicker>
		<view class="border"></view>
		<resumeDataPicker
			label="入学时间"
			placeholder="入学时间"
			v-model="startTime">
		</resumeDataPicker>
		<resumeDataPicker
			label="毕业时间"
			placeholder="毕业时间"
			v-model="endTime">
		</resumeDataPicker>
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
import resumeMenuPicker from "./Resume_menuPicker.vue"
export default {
	data() {
		return {
			index: null,
			is_remove: false,
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
	components: {
		resumeInput,
		resumeDataPicker,
		resumeMenuPicker
	},
	onLoad(e) {
		if(e.index){
			this.index = e.index
			const resume = getApp().globalData.gResume.eduExperiences[e.index]
			for(let key in resume){
				this[key] = resume[key]
			}
		}
		console.log(getApp().globalData.gResume.eduExperiences);
	},
	beforeDestroy() {
		if(this.index !== null && !this.is_remove){
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
				degree: this.degree,
				school: this.school,
				specialty: this.specialty,
				grade: this.grade,
				startTime: this.startTime,
				endTime: this.endTime,
			}
			if(this.index){
				getApp().globalData.gResume.eduExperiences[this.index] = data
			}
			else{
				if(getApp().globalData.gResume.eduExperiences){
					getApp().globalData.gResume.eduExperiences.push(data)
				}
				else{
					getApp().globalData.gResume.eduExperiences = [data]
				}
			}
			putResume(getApp().globalData.gResume)
		},
		/* 删除经历 */
		remove()
		{
			this.gShowModal("确认删除该经历？",() => {
				this.is_remove = true
				getApp().globalData.gResume.eduExperiences.splice(this.index,1)
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
