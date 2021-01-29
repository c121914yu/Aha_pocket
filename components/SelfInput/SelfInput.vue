<template>
	<view 
		:style="{
			width: contentWidth,
			'border-radius': circle ? '22px' : '8px'
		}"
		class="self-input">
		<view 
			:style="{
				color: labelColor
			}"
			class="label">
			{{label}}
		</view>
		<view class="main">
			<!-- 输入内容 -->
			<input
				:style="{ 
					'border-radius': circle ? '22px' : '8px'
				}"
				:type="type"
				:disabled="disabled"
				:value="value"
				:placeholder="placeholder"
				@input="inputing"/>
			<!-- 搜索结果 -->
			<view class="search-result">
				<view 
					class="result" 
					v-for="(result, index) in searchResult" 
					:key="index" 
					@click="checkResult(result)">
					{{ result }}
				</view>
			</view>
			<!-- 备注信息 -->
			<view class="remark">{{ remark }}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		/* 标签颜色 */
		labelColor: {
			type: String,
			default: "#ffffff"
		},
		/* 输入框宽度 */
		contentWidth: {
			type: String,
			default: '100%'
		},
		circle: {
			type: Boolean,
			default: false
		},
		/* 输入框提示内容 */
		placeholder: {
			type: String,
			default: ''
		},
		/* 备注信息 */
		remark: {
			type: String,
			default: ''
		},
		/* 绑定值 */
		value: String || Number,
		/* 文本类型 */
		type: {
			type: String,
			default: 'text'
		},
		/* 标签 */
		label: {
			type: String,
			default: ''
		},
		/* 类型 */
		search: {
			type: Boolean,
			default: false
		},
		/* 是否禁止 */
		disabled: {
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
			if (this.search) {
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
				console.log(this.searchResult);
			}
			this.$emit('input', value)
		},
		/*
			name: 点击搜索结果
			description: 点击搜索结果，将结果赋给输入值,并清空筛选结果。
			@params result: String,搜索结果
			@change this.value: String,输入值
			@change	this.searchResult: Array,筛选结果
			time: 2021/1/28
		*/
		checkResult(result) {
			this.searchResult = []
			this.$emit('input', result)
		}
	}
}
</script>

<style lang="stylus" scoped>
.self-input
	position relative
	margin 10px 0
	padding 1px
	background-color var(--origin2)
	display flex
	align-items center
	.label
		margin 0 10px
		font-size 22rpx
		white-space nowrap
	.main
		position relative
		flex 1
		display flex
		align-items center
		input
			flex 1
			padding 0 5px
			background-color #FFFFFF
			border 1px solid var(--origin4)
			font-size 24rpx
		.search-result
			z-index 5
			position absolute
			top 50rpx
			width 100%
			max-height 350rpx
			background-color #FFFFFF
			box-shadow 0 0 5px var(--origin2)
			border-radius 8px
			overflow-y auto
			overflow-x hidden
			.result
				text-align center
				height 60rpx
				line-height 60rpx
				font-size 24rpx
				white-space nowrap
				&.active
					background-color rgba(144, 140, 139, 0.5)
		.remark
			position absolute
			top 26px
			left 2px
			color var(--origin2)
			font-size 20rpx
</style>
