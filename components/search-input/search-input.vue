<!-- 
	带搜索按键的输入框
	author yjl
 -->
<template>
	<view 
		class="search-input"
		:style="{
			'border-radius': `${radius}px`,
			'border': border,
			'background': textBgColor
		}">
		<text class="iconfont icon-sousuo"></text>
		<input 
			:style="{
				'border-radius': `${radius}px`
			}"
			class="input"
			:type="type" 
			:value="value"
			:placeholder="placeholder" 
			v-model="searchText"
			@input="$emit('input',$event.detail.value)"/>
		<text 
			:style="{
				'color': textColor
			}"
			class="small search-text" 
			@click="$emit('search')">
			搜索
		</text>
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
		},
		radius: {
			type: Number,
			default: 22
		},
		border: {
			type: String,
			default: "none"
		},
		textColor: {
			type: String,
			default: "#ffffff"
		},
		textBgColor: {
			type: String,
			default: "var(--origin3)"
		}
	}
}
</script>

<style lang="stylus" scoped>
.search-input
	width 100%
	position relative
	display flex
	align-items center
	overflow hidden
	.iconfont
		position absolute
		margin-left 10px
		color var(--origin2)
	.input
		flex 1
		padding 5px 0 5px 30px
		background-color #FFFFFF
		font-size 24rpx
	.search-text
		padding 0 10px 0 8px
		font-weight 700
</style>
