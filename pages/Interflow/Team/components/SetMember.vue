<!-- 
	设置团队成员组件
	author yjl
-->
<template>
	<view class="fix-screen set-member">
		<view class="content">
			<view class="h3 center">设置成员信息</view>
			<view class="info">
				<view class="label">昵称:</view>
				<view class="val">{{member.memberRoughInfo.nickname}}</view>
			</view>
			<view class="info">
				<view class="label">担任角色:</view>
				<input class="val" type="text" placeholder="该队员担任的角色" maxlength="5" v-model="role">
			</view>
			<view class="info">
				<textarea class="val" placeholder="队员介绍" v-model="memberIntro"/>
			</view>
			<view class="btns">
				<button @click="onclickSure">确认</button>
				<button style="background-color: #5d7092;" @click="$emit('update:member',null)">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
import { putMemberInfo,inviteMember } from "@/static/request/api_team.js"
export default {
	props: {
		member: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			role: "",
			memberIntro: ""
		};
	},
	created() {
		if(!this.member.isNewMember){
			this.role = this.member.role
			this.memberIntro = this.member.memberIntro
		}
	},
	methods: {
		/**
		 * 判断该是否已经加入队伍，若不是则添加，若是则修改
		 */
		onclickSure()
		{
			const obj = {
				...this.member,
				role: this.role,
				memberIntro: this.memberIntro
			}
			if(this.member.isNewMember){
				inviteMember(this.member.tid,this.member.uid)
				.then(res => {
					this.$emit("addMember",obj)
				})
			}
			else{
				putMemberInfo({
					teamId: this.member.tid,
					role: this.role,
					memberIntro: this.memberIntro
				})
				this.$emit("putMember",obj)
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.set-member .content
	width 85%
	border-radius 8px
	.info
		margin 10px 0
		display flex
		align-items center
		.label
			width 60px
			font-size 24rpx
			color var(--origin1)
		.val
			flex 1
		input
			border var(--border2)
		textarea
			border var(--border2)
			height 100px
	.btns
		display flex
		button
			width 35%
</style>
