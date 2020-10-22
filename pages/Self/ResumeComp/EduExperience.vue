<template>
	<!-- 教育经历 -->
	<view
		class="card"
		:style="{
			'height': isEduExperience ? 'auto' : '110rpx'
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
			v-for="(edu,index) in eduExper"
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
				<text>学校</text>
				<SearchInput v-model="edu.school"></SearchInput>
			</view>
			<!-- 专业 -->
			<view class="item specialty">
				<text>专业</text>
				<input 
					class="input"
					type="text"
					hold-keyboard="true"
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
			<icon 
				class="remove" 
				type="clear" 
				size="22" 
				color="#e86452"
				@click="removeEdu(index)">
			</icon>
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
		return {
			eduExper: [], // 教育经历
			isEduExperience: true,
			Degress: [], // 学历数组
			Grades: [], // 成绩等级
		}
	},
	methods:{
		/*
			name: 添加教育经历
			description: 添加一组教育经历，往数组追加一组数据
			input: null
			return: null
			change: 
						eduExper: Array,教育经历数组
		*/
		addEdu()
		{
			this.eduExper.push({
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
						eduExper: Array,教育经历数组
		*/
		removeEdu(index)
		{
				 this.gShowModal("即将删除该教育经历",() => {
					 this.eduExper.splice(index,1)
				 })
		},
	},
	created() {
		this.Degress = getApp().globalData.Degress
		this.Grades = getApp().globalData.Grads
		/* 读取本地数据 */
		const story = JSON.parse(uni.getStorageSync("resume"))
		this.eduExper = story.eduExper
	},
}
</script>

<style lang="stylus">

</style>
