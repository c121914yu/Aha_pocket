<template>
	<!-- 可选择的输入框 -->
	<view class="search-input">
		<input 
			type="text" 
			:value="value"
			hold-keyboard="true"
			@input="inputing"/>
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
			allResults: ["浙江工业大学","杭州电子科技大学","浙江大学","杭州师范大学"],
			searchResult: []
		}
	},
	props: {
		value: {
			type: String,
			default: ""
		}
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
	.search-result
		z-index 5
		position absolute
		width 100%
		max-height 350rpx
		overflow hidden
		background-color #FFFFFF
		box-shadow 0 0 5px var(--origin2)
		border-radius 20rpx
		.result
			text-align center
			height 70rpx
			line-height 70rpx
			&.active
				background-color rgba(144,140,139,0.5)
</style>
