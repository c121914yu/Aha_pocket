<!-- 用户标签 -->
<template>
	<view class="tags">
		<view 
			:style="{
				'background-color': bgColor,
				'color': Color,
				'padding': padding
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
	name:"UserTags",
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
		}
	}
}
</script>

<style lang="stylus" scoped>
.tags
	display flex
	flex-wrap wrap
	.tag
		margin 0 4px 3px
		font-size 18rpx
		border-radius 22px
</style>
