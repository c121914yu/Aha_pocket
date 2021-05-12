<!-- 
	通用标签组件
	author yjl
-->
<template>
	<view class="tags">
		<view 
			:style="{
				'background-color': bgColor,
				'color': Color,
				'padding': padding,
				'border': border
			}"
			class="tag"
			v-for="(tag,index) in tags"
			:key="index">
			{{tag}}
		</view>
	</view>
</template>

<script>
export default {
	name:"aha-tags",
	props: {
		tags: {
			type: Array,
			default: () => []
		},
		bgColor: {
			type: String,
			default: "#f8b86b"
		},
		Color: {
			type: String,
			default: "#ffffff"
		},
		padding: {
			type: String,
			default: "0 10px"
		},
		border: {
			type: String,
			default: "none"
		}
	}
}
</script>

<style lang="stylus" scoped>
.tags
	display flex
	flex-wrap wrap
	.tag
		margin 0 4px 3px 0
		font-size 20rpx
		border-radius 22px
</style>
