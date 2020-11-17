<template>
	<!-- 可选择的输入框 -->
	<view class="search-input">
		<input 
			type="text" 
			:value="value"
			hold-keyboard="true"
			:placeholder="placeholder"
			@input="inputing"
			@blur="$emit('blur',$event.detail.value)"/>
		<view class="search-result">
			<view 
				class="result"
				v-for="(result,index) in searchResult"
				:key="index"
				@click="checkResult(result)">
				{{result}}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchResult: []
		}
	},
	props: {
		placeholder: {
			type: String,
			default: ""
		},
		allResults: {
			type: Array,
			default: () => []
		},
		value: {
			type: String,
			default: ""
		},
	},
	methods:{
		/* 
			name: 输入框输入内容
			description: 监听输入框输入，根据内容匹配含输入字段的结果
			input:
						e: Object,输入框自带参数，可获取输入值
			change:
						this.searchResult: Array,筛选结果
			return: null
		*/
		inputing(e)
		{
			const value = e.target.value
			/* 正则匹配包含字段的内容 */
			const filReg = new RegExp(value,'gi')
			/* 过滤筛选 */
			this.searchResult = this.allResults.filter(item => filReg.test(item))
			/* 如果只有1条匹配，且匹配结果与输入内容完全相同则不显示筛选 */
			if(this.searchResult.length === 1 && this.searchResult[0] === value)
			{
				this.searchResult = []
			}
			/* 值为空 */
			if(value === "")
			{
				this.searchResult = []
			}
			this.$emit("input",value)
		},
		/*
			name: 点击搜索结果
			description: 点击搜索结果，将结果赋给输入值,并清空筛选结果。
			input:
						result: String,搜索结果
			change:
						this.value: String,输入值
						this.searchResult: Array,筛选结果
			return: null
		*/
	 checkResult(result)
	 {
		 this.searchResult = []
		 this.$emit("input",result)
		 this.$emit('blur',result)
	 }
	}
}
</script>

<style lang="stylus" scoped>
.search-input
	position relative
	input
		padding 5rpx 15rpx
		background-color var(--origin2)
		border-radius 20px
	
</style>
