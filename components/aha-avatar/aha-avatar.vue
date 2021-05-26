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
			'background-color': bgColor,
			'border-radius': radius ? '50%' : '8px',
			'padding': radius ? '3px' : '0'
		}"
		@click="readImg">
		<image 
			class="img" 
			:style="{
				'border-radius': radius ? '50%' : '0'
			}"
			:src="src || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'" 
			:mode="radius ? 'aspectFill' : 'widthFix'">
		</image>
	</view>
</template>

<script>
export default {
	name:"aha-avatar",
	props: {
		src: {
			type: String,
			default: ""
		},
		size: {
			type: Number,
			default: 70
		},
		bgColor: {
			type: String,
			default: "var(--origin3)"
		},
		readed: {
			type: Boolean,
			default: false
		},
		radius: {
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
	flex-shrink 0
	overflow hidden
	display flex
	align-items center
	overflow hidden
	.img
		width 100%
		height 100%
		border-radius 50%
</style>
