<template>
	<!-- 校园经历 -->
	<view
		class="card experience">
		<text class="h3">校园经历</text>
		<view 
			class="list-itme"
			v-for="(exp,index) in experiences"
			:key="index">
			<!-- 组织 -->
			<view class="item">
				<text>组织</text>
				<input 
					class="input"
					type="text"
					v-model="exp.organization"/>
			</view>
			<!-- 职位 -->
			<view class="item">
				<text>职位</text>
				<input 
					class="input"
					type="text"
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
				<label class="checkbox">
					<checkbox value="男" color="#f8b86b"/>
					<text >至今</text>
				</label>
			</view>
			<!-- 经历描述 -->
			<view class="item description">
				<text>经历描述</text>
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
			+添加校园经历
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
					organization: "",
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
		width 72%
	.checkbox 
		margin-left 10px
		display flex
	.description
		padding-right 15rpx
		align-items flex-start
		flex-direction column
</style>
