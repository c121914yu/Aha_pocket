<!-- 带搜索图标输入框 -->
<template>
	<view class="search-input">
		<text class="iconfont icon-sousuo"></text>
		<input type="text" :value="value" :placeholder="placeholder" @input="$emit('input',$event.target.value)">	
	</view>
</template>

<script>
export default {
	props:{
		value: String,
		placeholder: {
			type: String,
			default: ""
		}
	},
}
</script>

<style lang="stylus" scoped>
.search-input
	position relative
	border-radius 22px
	display flex
	align-items center
	overflow hidden
	.iconfont
		position absolute
		margin-left 10px
		color var(--origin2)
	input
		flex 1
		padding-left 30px
		background-color #FFFFFF
</style>
