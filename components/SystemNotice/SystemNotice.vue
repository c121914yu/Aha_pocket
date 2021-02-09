<!-- 系统公告 -->
<template>
	<view class="notice fix-screen" @click="$emit('close')" @touchmove.stop.prevent>
		<view class="content" @click.stop>
			<text class="iconfont icon-guanbi" @click="$emit('close')"></text>
			<view class="notice">
				<view class="center h3">{{notices[currentPage].title}}</view>
				<view class="notice-content" v-html="notices[currentPage].content"></view>
			</view>
			<text class="page small">{{currentPage+1}} / {{notices.length}}</text>
			<view class="ctr">
				<text 
					v-if="currentPage!==0"
					class="left-icon iconfont icon-right"
					@click="currentPage--">
				</text>
				<text 
					v-if="currentPage!==notices.length-1" 
					class="right-icon iconfont icon-right"
					@click="currentPage++">
				</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		notices: Array
	},
	data(){
		return{
			currentPage: 0
		}
	},
}
</script>

<style lang="stylus" scoped>
.notice
	.content
		position relative
		width 92%
		box-shadow var(--shadow2)
		border-radius 8px
		/* 关闭图标 */
		.icon-guanbi
			position absolute
			right 10px
			top 5px
			color var(--origin1)
			font-size 45rpx
		/* 公告内容 */
		.notice
			margin-bottom 10px
			padding 0 10px
			.notice-content
				height 50vh
				padding 0 10px
				white-space pre-wrap
				overflow auto
		/* 页码 */
		.page
			position absolute
			right 10px
			bottom 5px
		/* 切页图标 */
		.ctr
			.iconfont
				position absolute
				top 50%
				transform translateY(-50%)
				display inline-block
				font-size 40rpx
				width 30px
				height 30px
				text-align center
				line-height 30px
				background-color var(--origin4)
				border-radius 50%
			.left-icon
				left 5px
				transform translateY(-50%) rotate(180deg)
			.right-icon
				right 5px
</style>
