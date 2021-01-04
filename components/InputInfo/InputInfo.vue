<template>
	<view class="input-info">
		<view class="title" v-html="title"></view>
		<view class="main">
			<!-- 输入内容 -->
			<input
				v-if="type !== 'select'"
				class="input"
				:style="{ width: contentWidth }"
				:type="inputType"
				:disabled="disable"
				:value="value"
				:placeholder="placeholder"
				@input="inputing"
				@blur="$emit('blur',$event.detail.value)"/>
			<!-- 搜索结果 -->
			<view 
				v-if="type === 'search'"
				class="search-result"
				:style="{ width: contentWidth }">
				<view 
					class="result"
					v-for="(result,index) in searchResult"
					:key="index"
					@click="checkResult(result)">
					{{result}}
				</view>
			</view>
			<!-- 选择框 -->
			<picker
				v-if="type === 'select'"
				:style="{ width: contentWidth }"
				mode="selector" 
				:range="list" 
				@change="select">
				<view class="input select">
					<text class="value">{{value}}</text>
					<text class="iconfont icon-xiala"></text>
				</view>
			</picker>
			<view class="remark">{{remark}}</view>
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
		/* 绑定值 */
		value: {
			type: String,
			default: ''
		},
		/* 提示标题 */
		title: {
			type: String,
			default: ""
		},
		/* 类型 */
		type: {
			type: String,
			default: "input"
		},
		/* 是否禁止 */
		disable: {
			type: Boolean,
			default: false
		},
		/* 文本类型 */
		inputType: {
			type: String,
			default: "text"
		},
		/* 选择框内容 */
		range: {
			type: Array,
			default: () => []
		},
		/* 输入框宽度 */
		contentWidth: {
			type: String,
			default: "100%"
		},
		/* 输入框提示内容 */
		placeholder: {
			type: String,
			default: ""
		},
		/* 备注信息 */
		remark: {
			type: String,
			default: ""
		},
		/* 搜索框内容 */
		allResults: {
			type: Array,
			default: () => []
		},
	},
	methods: {
		/*
			name: 输入框输入内容
			description: 监听输入框输入，根据内容匹配含输入字段的结果
			input:
						e: Object,输入框自带参数，可获取输入值
			change:
						this.searchResult: Array,筛选结果
			time: 2020/11/17
		*/
		inputing(e)
		{
			const value = e.target.value
			/* 若是普通输入，直接赋值 */
			if(this.type === "input")
			{
				this.$emit("input",value)
				return
			}
			/* 正则匹配包含字段的内容 */
			const filReg = new RegExp(value,'gi')
			/* 过滤筛选 */
			this.searchResult = this.allResults.filter(item => filReg.test(item))
			/* 如果只有1条匹配，且匹配结果与输入内容完全相同则不显示筛选 */
			if(this.searchResult.length === 1 && this.searchResult[0] === value)
				this.searchResult = []
			/* 值为空 */
			if(value === "")
				this.searchResult = []
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
			time: 2020/11/17
		*/
		checkResult(result)
		{
			 this.searchResult = []
			 this.$emit("input",result)
			 this.$emit('blur',result)
		},
		select(e){
			this.$emit('input',this.list[e.target.value])
		}
	},
  computed: {
    list(){
      return this.range.map(item => item.label)
    }
  }
}
</script>

<style lang="stylus" scoped>
.input-info
	display flex
	.title
		margin 5rpx 10rpx 0 0
		color var(--origin2)
		font-size 24rpx
		white-space nowrap
	.main
		position relative
		flex 1
		display flex
		align-items center
		flex-wrap wrap
		.select
			position relative
			width 100%
			display flex
			align-items center
			.value
				flex 1
			.iconfont
				color var(--origin2)
		.input
			max-width 100%
			padding 0 10rpx
			background-color var(--origin3)
			border-radius 30rpx
			font-size 24rpx
		.remark
			margin 5rpx
			width 100%
			color var(--origin2)
			font-size 20rpx
		.search-result
			z-index 5
			position absolute
			top 50rpx
			width 100%
			max-height 350rpx
			overflow auto
			background-color #FFFFFF
			box-shadow 0 0 5px var(--origin2)
			border-radius 20rpx
			.result
				text-align center
				height 60rpx
				line-height 60rpx
				font-size 24rpx
				white-space nowrap
				&.active
					background-color rgba(144,140,139,0.5)
</style>
