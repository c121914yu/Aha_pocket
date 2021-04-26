<template>
	<view class="search-input">
		<text class="iconfont icon-sousuo"></text>
		<input 
			:type="type" 
			:value="value"
			:placeholder="placeholder" 
			v-model="searchText"
			@input="$emit('input')"/>
		<text class="small search-text" @click="$emit('search')">搜索</text>
	</view>
</template>

<script>
export default {
	props: {
		value: String | Number,
		type: {
			type: String,
			default: "text"
		},
		placeholder: {
			type: String,
			default: ""
		}
	}
}
</script>

<style lang="stylus" scoped>
.search-input
	position relative
	background-color var(--origin3)
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
		padding 5px 0 5px 30px
		background-color #FFFFFF
		font-size 24rpx
		border-radius 22px
	.search-text
		padding 0 10px 0 8px
		color #FFFFFF
		font-weight 700
</style>
