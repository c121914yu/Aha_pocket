<!-- 兑换 -->
<template>
	<view class="conversion fix-screen">
		<view class="content">
			<view class="center h3">兑换Aha点</view>
			<input type="text" placeholder="兑换码" v-model="code">
			<view class="btns">
				<view class="cancel" @click="$emit('close')">取消</view>
				<view class="confirm" @click="confirm">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
import { useCDKEY } from "@/static/request/api_system.js"
export default {
	data() {
		return {
			code: ""
		};
	},
	methods: {
		confirm()
		{
			if(this.code){
				useCDKEY(this.code)
				.then(res => {
					this.$emit("finish")
					this.gToastSuccess("兑换成功")
				})
				.catch(err => {
					this.code = ""
				})
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.conversion
	.content
		width 90%
		border-radius 8px
		input
			margin 20px 0
			border var(--border2)
		.btns
			display flex
			text-align center
			.cancel
				width 50%
				color var(--gray1)
				border-right 2px solid var(--origin2)
			.confirm
				width 50%
				color var(--origin1)
</style>
