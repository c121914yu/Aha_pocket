<template>
	<!-- 教育经历 -->
	<view
		class="card"
		:style="{
			'height': isEduExperience ? 'auto' : '14px'
		}">
		<text
			class="fold iconfont icon-xiala"
			:style="{
				'transform': isEduExperience ? 'rotate(0)' : 'rotate(180deg)'
			}"
			@click="isEduExperience=!isEduExperience">
		</text>
		<text class="h3">教育经历</text>
		<!-- 教育经历内容填写 -->
		<view 
			class="list-itme"
			v-for="(edu,index) in eduExperiences"
			:key="index">
			<!-- 学历 -->
			<view class="item degree">
				<text>学历</text>
				<SPicker 
					placeholder="本科,硕士"
					startIndex="3"
					:range="Degress"
					v-model="edu.degree">
				</SPicker>
			</view>
			<!-- 学校选择，可选择输入框 -->
			<view class="item school">
				<InputInfo
					title="学校"
					type="search"
					:allResults="Schools"
					contentWidth="400rpx"
					v-model="edu.school">
				</InputInfo>
			</view>
			<!-- 专业 -->
			<view class="item specialty">
				<text>专业</text>
				<input 
					class="input"
					type="text"
					v-model="edu.specialty"/>
			</view>
			<!-- 成绩 -->
			<view class="item degree">
				<text>成绩排名</text>
				<SPicker 
					:range="Grades"
					v-model="edu.grade">
				</SPicker>
			</view>
			<!-- 在校时间 -->
			<view class="item edu-time">
				<text>在校时间</text>
				<DataPicker
					placeholder="2018-9"
					startTime="2010-1"
					endTime="2030-12"
					v-model="edu.startTime">
				</DataPicker>
				<view>-</view>
				<DataPicker
					placeholder="2018-9"
					startTime="2010-1"
					endTime="2030-12"
					v-model="edu.endTime">
				</DataPicker>
			</view>
			<!-- 删除按键 -->
			<text class="remove iconfont icon-remove" @click="removeEdu(index)"></text>
		</view>
		<button 
			class="add-btn"
			@click="addEdu">
			+添加教育经历
		</button>
	</view>
</template>

<script>
export default {
	data() {
		/* 读取全局 */
		const Schools = getApp().globalData.Schools
		const Degress = getApp().globalData.Degress
		const Grades = getApp().globalData.Grads
		let eduExperiences = getApp().globalData.gResume.eduExperiences
		eduExperiences = eduExperiences ? JSON.parse(JSON.stringify(eduExperiences)) : []
		return {
			eduExperiences, // 教育经历
			isEduExperience: true,
			Degress, // 学历数组
			Grades, // 成绩等级
			Schools,
		}
	},
	methods:{
		/*
			name: 添加教育经历
			description: 添加一组教育经历，往数组追加一组数据
			input: null
			return: null
			change: 
						eduExperiences: Array,教育经历数组
		*/
		addEdu()
		{
			this.eduExperiences.push({
				degree: "",
				school: "",
				specialty: "",
				grade: "",
				startTime: "",
				endTime: ""
			})
		},
		/*
			name: 删除教育经历
			description: 删除一组教育教育经历
			input: 
						index: Number,经历的下标
			return: null
			change: 
						eduExperiences: Array,教育经历数组
		*/
		removeEdu(index)
		{
				 this.gShowModal("即将删除该教育经历",() => {
					 this.eduExperiences.splice(index,1)
				 })
		},
	}
}
</script>

<style lang="stylus">

</style>
