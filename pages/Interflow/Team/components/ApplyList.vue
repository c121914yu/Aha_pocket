<!-- 
	申请加入列表弹窗
-->
<template>
	<view class="apply-list fix-screen">
		<view class="content">
			<view class="h3 center">申请列表</view>
			<text class="close iconfont icon-tianjia" @click="$emit('close')"></text>
		</view>
	</view>
</template>

<script>
import { checkApply } from "@/static/request/api_team.js"
export default {
	props: {
		arr_applyMembers: {
			type: Array,
			default: () => []
		}
	},
	created() {
		checkApply({
			teamId: this.arr_applyMembers[0].tid,
			memberId: this.arr_applyMembers[0].uid,
			state: 1
		})
		.then(res => {
			console.log(res);
		})
	},
	data() {
		return {
			
		};
	}
}
</script>

<style lang="stylus" scoped>
.apply-list .content
	width 90%
	border-radius 8px
	height 70vh
	.close
		position absolute
		 right 10px
		 top 5px
		 font-size 40rpx
		 transform rotate(45deg)
</style>
