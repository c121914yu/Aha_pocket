<!-- 
	系统公告
	author yjl
-->
<template>
	<view 
		v-if="arr_notices.length>0" 
		class="aha-notice fix-screen"
		@touchmove.stop>
		<view class="content">
			<text class="iconfont icon-guanbi" @click="closeNotice"></text>
			<view class="notice" @click="gReadRichText(arr_notices[currentPage].content,arr_notices[currentPage].title)">
				<view class="center h3">{{arr_notices[currentPage].title}}</view>
				<scroll-view 
					class="notice-content rich-text" 
					scroll-y="scroll-y">
					<rich-text :nodes="arr_notices[currentPage].content"></rich-text>
				</scroll-view>
			</view>
			<text class="page small">{{currentPage+1}} / {{arr_notices.length}}</text>
			<view class="ctr">
				<text 
					v-if="currentPage!==0"
					class="left-icon iconfont icon-right"
					@click="currentPage--">
				</text>
				<text 
					v-if="currentPage!==arr_notices.length-1" 
					class="right-icon iconfont icon-right"
					@click="currentPage++">
				</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getNotice } from "@/static/request/api_system.js"
export default {
	data(){
		return{
			arr_notices: [],
			currentPage: 0,
		}
	},
	methods: {
		/**
		 * 加载系统公告
		 */
		loadNotice()
		{
			getNotice()
			.then(res => {
				console.log("系统公告: ",res.data)
				res.data.forEach(item => {
					item.createTime = this.gformatDate(item.createTime,true)
					this.arr_notices.push(item)
				})
				/* 要展示弹窗，阻止父组件滚动 */
				if(this.arr_notices.length >= 0) {
					this.$emit("isSlide",false)
				}
			})
		},
		/**
		 * 关闭弹窗,清空公告，允许父组件滚动
		 */
		closeNotice()
		{
			this.arr_notices = []
			this.$emit("isSlide",true)
		}
	}
}
</script>

<style lang="stylus" scoped>
.aha-notice
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
			padding 0 15px 0 10px
			.h3
				margin-bottom 5px
			.notice-content
				max-height 70vh
				overflow-y auto
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
