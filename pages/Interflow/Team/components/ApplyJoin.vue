<!-- 
	申请加入弹窗
	author yjl
-->
<template>
	<view class="apply-join fix-screen">
		<view class="content">
			<view class="h3 center">申请加入团队</view>
			<textarea 
				class="textarea" 
				focus="focus"
				:show-confirm-bar="false"
				placeholder="简单描述下自己" 
				v-model="applyIntro"/>
			<view class="btns">
				<button class="btn" style="background-color: #5d7092;" @click="$emit('close')">取消</button>
				<button class="btn" @click="onclickSure">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
import { applyJoinTeam } from "@/static/request/api_team.js"
export default {
	props: {
		teamId: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			applyIntro: ""
		};
	},
	methods: {
		/**
		 * 点击确认，调用申请加入团队AP
		 */
		onclickSure()
		{
			if(!this.applyIntro) {
				return
			}
			this.gShowModal("您的简历将发送给对方,确认申请加入?",() => {
				applyJoinTeam({
					teamId: this.teamId,
					intro: this.applyIntro
				})
				this.gToastSuccess("提交申请成功")
				this.$emit("submitApply",this.applyIntro)
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.apply-join .content
	width 90%
	border-radius 8px
	.textarea
		margin 10px 0
		width 100%
		height 150px
		border var(--border2)
		border-radius 4px
	.btns
		display flex
		.btn
			width 35%
</style>
