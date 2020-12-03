<!-- 绑定手机号 -->
<template>
	<view class="bind-phone">
		<div class="content">
			<button 
				open-type="getPhoneNumber" 
				:bindgetphonenumber="getPhoneNumber">
				绑定手机号
			</button>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	methods: {
		getPhoneNumber(e)
		{
			console.log(e);
		}
	}
}
</script>

<style lang="stylus">
.bind-phone
	z-index 5
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(0,0,0,0.5)
	display flex
	align-items center
	justify-content center
	.content
		width 80%
		padding 20px
		background-color #FFFFFF
		border-radius 8px
</style>
