<!-- 
	通用全屏底部按键组件
	author yjl
 -->
<template>
	<view 
		:style="{
			'background-color': bgColor
		}"
		class="bottom-btn">
		<button
			:style="{
				'margin': '10px 15%',
				'background-color': btnColor,
				'color': bgColor,
				'padding': padding
			}"
			@click="clickBtn">
			<slot></slot>
			{{text}}
		</button>
	</view>
</template>

<script>
export default {
	props: {
		text: String,
		bgColor: {
			type: String,
			default: "var(--origin2)"
		},
		btnColor: {
			type: String,
			default: "#FFFFFF"
		},
		padding: {
			type: String,
			default: "2px"
		},
		linkTo: {
			type: String,
			default: ""
		}
	},
	methods: {
		clickBtn()
		{
			if(this.linkTo){
				uni.navigateTo({
					url: this.linkTo
				})
			}
			else{
				this.$emit('click')
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.bottom-btn
	z-index 5
	position fixed
	bottom 0
	left 0
	right 0
	border-top-left-radius 22px
	border-top-right-radius 22px
	padding-bottom constant(safe-area-inset-bottom)
	padding-bottom env(safe-area-inset-bottom)
</style>
