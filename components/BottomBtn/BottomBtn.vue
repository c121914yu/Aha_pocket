<template>
	<view 
		:style="{
			'background-color': bgColor
		}"
		class="bottom-btn">
		<button
			:style="{
				'background-color': btnColor,
				'color': bgColor,
				'padding': padding
			}"
			@click="clickBtn">
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
	padding 10px
	border-top-left-radius 22px
	border-top-right-radius 22px
	button
		margin 0 15%
</style>
