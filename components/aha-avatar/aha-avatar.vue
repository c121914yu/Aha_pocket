<!-- 
	项目通用头像组件
	author yjl
-->
<template>
	<view 
		class="avatar"
		:style="{
			'width': `${size}px`,
			'height': `${size}px`,
			'background-color': bgColor
		}"
		@click="readImg">
		<image class="img" :src="src" mode="widthFix"></image>
	</view>
</template>

<script>
export default {
	name:"aha-avatar",
	props: {
		src: {
			type: String,
			default: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png"
		},
		size: {
			type: Number,
			default: 80
		},
		bgColor: {
			type: String,
			default: "var(--origin3)"
		},
		readed: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		readImg()
		{
			if(this.readed){
				this.gReadImage([this.src])
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.avatar
	margin-bottom 10px
	flex-shrink 0
	width 80px
	height 80px
	border-radius 8px
	overflow hidden
	display flex
	align-items center
	overflow hidden
	.img
		width 100%
</style>
