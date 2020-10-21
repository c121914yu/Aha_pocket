<template>
	<!-- 荣誉情况 -->
	<view
		class="card honor">
		<text class="h3">荣誉情况</text>
		<view class="small">证书,竞赛,论文,软著等获得经历</view>
		<view 
			class="list-itme"
			v-for="(honor,index) in honorList"
			:key="index">
			<view 
				class="item honor-name">
				<text>荣誉名称</text>
				<input
					class="input" 
					style="width: 100%" 
					type="text"
					placeholder-class="placeholderStyle"
					placeholder="服务外包大赛全国一等奖 / ***论文第一作者"
					v-model="honor.name"/>
			</view>
			<!-- 获得时间 -->
			<view class="item edu-time">
				<text>获得时间</text>
				<DataPicker
					placeholder="2020-9"
					v-model="honor.time">
				</DataPicker>
			</view>
			<!-- 获奖描述 -->
			<view class="item description">
				<text>荣誉描述</text>
				<textarea
					style="height: 200rpx;" 
					placeholder="简单描述下项目内容及个人负责的内容."
					placeholder-class="placeholderStyle"
					v-model="honor.description"/>
			</view>
			<!-- 删除按键 -->
			<icon 
				class="remove" 
				type="clear" 
				size="22" 
				color="#e86452"
				@click="removePrize(index)">
			</icon>
		</view>
		<button
			class="add-btn"
			@click="addHonor">
			+添加荣誉情况
		</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			honorList: []
		}
	},
	methods: {
		/*
				name: 添加荣誉情况
				description: 添加一组荣誉情况，往数组追加一组数据
				input: null
				return: null
				change: 
							honorList: Array,荣誉情况数组
			*/
		 addHonor()
		 {
				this.honorList.push({
					name: "",
						time: "",
						description: ""
				})
			},
		 /*
			name: 删除荣誉情况
			description: 删除一组荣誉情况
			input: 
						index: Number,荣誉数组的下标
			return: null
			change: 
						honorList: Array,荣誉数组
		*/
		 removeHonor(index)
		 {
			 this.gShowModal("即将删除该获奖情况",() => {
				 this.honorList.splice(index,1)
			 })
		 },
	}
}
</script>

<style lang="stylus" scoped>
.honor 
	.honor-name
		display block
		.input
			margin-top 5px
			border-radius 5px
	.description
		align-items flex-start
		flex-direction column
</style>
