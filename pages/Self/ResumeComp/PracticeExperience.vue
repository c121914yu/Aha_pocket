<template>
	<!-- 实习经历 -->
	<view
		class="card experience"
		:style="{
			'height': isPracticeExper ? 'auto' : '14px'
		}">
		<text
			class="fold iconfont icon-xiala"
			:style="{
				'transform': isPracticeExper ? 'rotate(0)' : 'rotate(180deg)'
			}"
			@click="isPracticeExper=!isPracticeExper">
		</text>
		<text class="h3">实习经历</text>
		<view 
			class="list-itme"
			v-for="(exp,index) in practiceExperiences"
			:key="index">
			<!-- 公司名称 -->
			<view class="item">
				<text>公司</text>
				<input 
					class="input"
					type="text"
					hold-keyboard="true"
					v-model="exp.company"/>
			</view>
			<!-- 职位 -->
			<view class="item">
				<text>职位</text>
				<input 
					class="input"
					type="text"
					hold-keyboard="true"
					v-model="exp.post"/>
			</view>
			<!-- 经历时间 -->
			<view class="item edu-time">
				<text>时间</text>
				<DataPicker
					placeholder="2018-9"
					v-model="exp.startTime">
				</DataPicker>
				<view>-</view>
				<DataPicker
					placeholder="2020-9"
					v-model="exp.endTime">
				</DataPicker>
				<label
					class="checkbox"  
					@click="practiceExperiences[index].endTime = exp.endTime === '至今' ? '' : '至今'">
					<checkbox color="#f8b86b" :checked="exp.endTime === '至今'"/>
					<text >至今</text>
				</label>
			</view>
			<!-- 实习描述 -->
			<view class="item description">
				<text>实习描述</text>
				<textarea
					style="height: 200rpx;"
					hold-keyboard="true"
					v-model="exp.description"/>
			</view>
			<!-- 删除按键 -->
			<text class="remove iconfont icon-remove" @click="removeExperience(index)"></text>
		</view>
		<button
			class="add-btn"
			@click="addExperience">
			+添加实习经历
		</button>
	</view>
</template>

<script>
export default {
	data() {
		let practiceExperiences = getApp().globalData.gResume.practiceExperiences
		practiceExperiences = practiceExperiences ? JSON.parse(JSON.stringify(practiceExperiences)) : []
		return {
			practiceExperiences,
			isPracticeExper: true
		}
	},
	methods: {
		/*
				name: 添加经历
				description: 添加一组经历，往数组追加一组数据
				input: null
				return: null
				change: 
							practiceExperiences: Array,教育经历数组
			*/
		 addExperience()
		 {
				this.practiceExperiences.push({
					company: "",
					post: "",
					startTime: "",
					endTime: "",
					description: ""
				})
			},
		 /*
			name: 删除经历
			description: 删除一组经历
			input: 
						index: Number,经历的下标
			return: null
			change: 
						practiceExperiences: Array,教育经历数组
		*/
		 removeExperience(index)
		 {
			 this.gShowModal("即将删除该实习经历",() => {
				 this.practiceExperiences.splice(index,1)
			 })
		 },
	}
}
</script>

<style lang="stylus" scoped>
.experience
	padding 40rpx
	input
		width 65%
	.checkbox
		margin-left 10px
		display flex
	.description
		padding-right 15rpx
		align-items flex-start
		flex-direction column
</style>
