<template>
	<!-- 项目经历 -->
	<view
		class="card experience"
		:style="{
			'height': isProjectExper ? 'auto' : '14px'
		}">
		<text
			class="fold iconfont icon-xiala"
			:style="{
				'transform': isProjectExper ? 'rotate(0)' : 'rotate(180deg)'
			}"
			@click="isProjectExper=!isProjectExper">
		</text>
		<text class="h3">项目经历</text>
		<view 
			class="list-itme"
			v-for="(exp,index) in projectExperiences"
			:key="index">
			<!-- 项目名称 -->
			<view class="item">
				<text>项目名称</text>
				<input 
					class="input"
					type="text"
					hold-keyboard="true"
					v-model="exp.name"/>
			</view>
			<!-- 负责内容 -->
			<view class="item">
				<text>负责内容</text>
				<input 
					class="input"
					type="text"
					hold-keyboard="true"
					v-model="exp.content"/>
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
					@click="projectExperiences[index].endTime = exp.endTime === '至今' ? '' : '至今'">
					<checkbox color="#f8b86b" :checked="exp.endTime === '至今'"/>
					<text >至今</text>
				</label>
			</view>
			<!-- 项目描述 -->
			<view class="item description">
				<text>项目描述</text>
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
			+添加项目经历
		</button>
	</view>
</template>

<script>
export default {
	data() {
		let projectExperiences = getApp().globalData.gResume.projectExperiences
		projectExperiences = projectExperiences ? JSON.parse(JSON.stringify(projectExperiences)) : []
		return {
			projectExperiences,
			isProjectExper: true
		}
	},
	methods: {
		/*
				name: 添加经历
				description: 添加一组经历，往数组追加一组数据
				input: null
				return: null
				change: 
							projectExperiences: Array,教育经历数组
			*/
		 addExperience()
		 {
				this.projectExperiences.push({
					name: "",
					content: "",
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
						projectExperiences: Array,教育经历数组
		*/
		 removeExperience(index)
		 {
			 this.gShowModal("即将删除该项目经历",() => {
				 this.projectExperiences.splice(index,1)
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
		display flex
		flex-direction column
		align-items flex-start
</style>
