<!-- 
	用户等级组件，根据点数自动计算
	author yjl
-->
<template>
	<view 
		class="user-level"
		:style="{
			'margin': margin,
			'background-color': backgroundColor,
			'color': color,
			'font-siize': small ? '22rpx' : '24rpx',
			'padding': small ? '0 6px 0 20px' : '0 10px 0 25px'
		}">
		<image 
			:style="{
				'width': small ? '16px' : '20px'
			}"
			class="img"
			:src="userLevel.src" 
			mode="widthFix">
		</image>
		{{userLevel.label}}
	</view>
</template>

<script>
export default {
	name:"aha-user-level",
	props: {
		point: {
			type: Number,
			default: 0
		},
		small: {
			type: Boolean,
			default: false
		},
		backgroundColor: {
			type: String,
			default: "#f8b86b"
		},
		color: {
			type: String,
			default: "#ffffff"
		},
		margin: {
			type: String,
			default: "0"
		}
	},
	data(){
		return {
				userLevel: getApp().globalData.garr_userLevel[0],
		}
	},
	watch: {
		point: {
			handler: function(val){
				this.userLevel =  getApp().globalData.garr_userLevel.find(item => this.point < item.totalContribPoint)
			},
			immediate: true
		}
	}
}
</script>

<style lang="stylus" scoped>
.user-level
	position relative
	border-radius 22px
	font-size 24rpx
	display flex
	align-items center
	.img
		position absolute
		left 0
		top 0
		width 20px
		height 25px
</style>
