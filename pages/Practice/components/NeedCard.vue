<template>
	<view class="need-card" @click="$emit('click')">
		<!-- 价格 -->
		<view class="price">￥{{need.price}}25</view>
		<view class="header">
			<aha-avatar :src="need.avatar" size="60"></aha-avatar>
			<view class="right">
				<view class="name strong">{{need.name}}</view>
				<view class="tags">
					<view 
						class="tag"
						v-for="(tag,index) in need.tags"
						:key="index">
						{{tag}}
					</view>
				</view>
				
			</view>
		</view>
		<view class="footer">
			<view class="intro">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos cumque animi et laboriosam voluptatum distinctio officia optio quis sit odit est nisi id fugit deserunt magni autem natus deleniti. Ex vitae impedit sequi culpa fugiat non cumque dolorum dicta eum incidunt quia quidem blanditiis voluptatibus laboriosam amet voluptas laborum sit!</view>
			<view class="right">
				<view>已投: 50</view>
				<view>{{need.time}}</view>
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	props: {
		need: Object
	},
	data() {
		return {
			
		}
	}
}
</script>

<style lang="stylus" scoped>
.need-card
	position relative
	margin 10px 3%
	padding 10px 10px 10px 15px
	border-radius 22px
	background-color #FFFFFF
	.price
		position absolute
		right 10px
		top 10px
		color var(--origin2)
		font-weight 700
	.header
		display flex
		.right
			margin-left 10px
			flex 1
			.name
				margin-right 70px
				word-break break-all
				font-size 24rpx
			.tags
				padding 2px 0 2px 10px
				display flex
				flex-wrap wrap
				.tag
					margin 0 5px 5px 0
					font-size 18rpx
					padding 0 10px
					border-radius 22px
					background-color var(--origin2)
					color #FFFFFF
		
	.footer
		display flex
		align-items flex-end
		.intro
			height 52px
			font-size 20rpx
			line-height 1.7
			padding 0 5px
			border-radius 8px
			background-color var(--white1)
			display -webkit-box
			-webkit-box-orient vertical
			-webkit-line-clamp 3
			overflow hidden
		.right
			margin-left 10px
			text-align center
			font-size 20rpx
			color var(--gray1)
</style>
