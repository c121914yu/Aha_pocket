<template>
	<!-- 项目经历 -->
	<view
		class="card experience">
		<text class="h3">项目经历</text>
		<view 
			class="list-itme"
			v-for="(exp,index) in experiences"
			:key="index">
			<!-- 项目名称 -->
			<view class="item">
				<text>项目名称</text>
				<input 
					class="input"
					type="text"
					v-model="exp.name"/>
			</view>
			<!-- 负责内容 -->
			<view class="item">
				<text>负责内容</text>
				<input 
					class="input"
					type="text"
					v-model="exp.post"/>
			</view>
			<!-- 经历时间 -->
			<view class="item edu-time">
				<text>经历时间</text>
				<DataPicker
					placeholder="2018-9"
					v-model="exp.startTime">
				</DataPicker>
				<view>-</view>
				<DataPicker
					placeholder="2020-9"
					v-model="exp.endTime">
				</DataPicker>
			</view>
			<!-- 项目描述 -->
			<view class="item description">
				<text>项目描述</text>
				<textarea
					style="height: 200rpx;"
					v-model="exp.description"/>
			</view>
			<!-- 删除按键 -->
			<icon 
				class="remove" 
				type="clear" 
				size="22" 
				color="#e86452"
				@click="removeExperience(index)">
			</icon>
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
		return {
			experiences: []
		}
	},
	methods: {
		/*
				name: 添加经历
				description: 添加一组经历，往数组追加一组数据
				input: null
				return: null
				change: 
							experiences: Array,教育经历数组
			*/
		 addExperience()
		 {
				this.experiences.push({
					name: "",
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
						experiences: Array,教育经历数组
		*/
		 removeExperience(index)
		 {
			 this.gShowModal("即将删除该个人经历",() => {
				 this.experiences.splice(index,1)
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
	.description
		padding-right 15rpx
		align-items flex-start
		flex-direction column
</style>
