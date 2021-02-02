<template>
	<view class="resume-input">
		<view class="label">{{label}}</view>
		<input 
			class="value" 
			:value="value"
			:type="type" 
			:placeholder="placeholder"
			placeholder-style="font-size:32rpx;color var(--gray2)"
			@input="inputing">
		<view class="search-result">
			<view 
				class="item"
				v-for="(item,index) in searchResult"
				:key="index"
				@click="$emit('input',item);searchResult=[]">
				{{item}}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: ""
		},
		placeholder: {
			type: String,
			default: ""
		},
		value: String | Number,
		type: {
			type: String,
			default: "text"
		},
		search: {
			type: Boolean,
			default: false
		},
		/* 搜索框内容 */
		arr_search: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			searchResult: []
		};
	},
	methods: {
		/*
			name: 输入框输入内容
			description: 监听输入框输入，根据内容匹配含输入字段的结果
			@params e: Object,输入框自带参数，可获取输入值
			@change this.searchResult: Array,筛选结果
			time: 2021/1/28
		*/
		inputing(e) {
			const value = e.target.value
			/* 搜索模式，触发搜索结果 */
			if (this.arr_search.length > 0) {
				/* 正则匹配包含字段的内容 */
				const filReg = new RegExp(value, 'gi');
				/* 过滤筛选 */
				this.searchResult = this.arr_search.filter(item => filReg.test(item));
				/* 如果只有1条匹配，且匹配结果与输入内容完全相同则不显示筛选 */
				if (this.searchResult.length === 1 && this.searchResult[0] === value){
					this.searchResult = [];
				} 
				/* 值为空 */
				if (value === ''){
					this.searchResult = [];
				} 
			}
			this.$emit('input', value)
		},
	}
}
</script>

<style lang="stylus" scoped>
.resume-input
	position relative
	padding 10px 0
	.label
		font-size 26rpx
	.value
		font-size 32rpx
		font-weight 700
		padding 0
		color var(--black)
	.search-result
		z-index 20
		position absolute
		margin-top 5px
		width 100%
		max-height 350rpx
		background-color #FFFFFF
		box-shadow 0 0 5px var(--origin3)
		border-radius 8px
		overflow-y auto
		overflow-x hidden
		.item
			text-align center
			height 35px
			line-height 35px
			font-size 24rpx
			white-space nowrap
</style>
