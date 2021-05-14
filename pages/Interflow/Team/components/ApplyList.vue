<!-- 
	申请加入列表弹窗
-->
<template>
	<view class="apply-list fix-screen">
		<view class="content">
			<view class="h3 center">申请列表</view>
			<text class="close iconfont icon-tianjia" @click="$emit('close')"></text>
			<!-- 用户列表 -->
			<view class="members">
				<view
					class="member"
					v-for="(member,i) in arr_applyMembers"
					:key="member.uid">
					<view class="main">
						<aha-avatar :src="member.userInfo.avatarUrl" size="60"></aha-avatar>
						<view class="right">
							<view class="name">
								<view class="label">用户名:</view> 
								<view class="val">{{member.userInfo.nickname}}</view>
							</view>
							<view class="time">
								<view class="label">申请时间:</view> 
								<view class="val">{{member.applyTime}}</view>
							</view>
							<view class="btns">
								<button class="btn pass" @click="onclickCheck(member,i,true)">通过</button>
								<button class="btn refuse" @click="onclickCheck(member,i,false)">拒绝</button>
							</view>
						</view>
					</view>
					<view class="intro rich-text" v-html="member.intro || '无申请介绍'"></view>
				</view>
			</view>
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
	methods: {
		/**
		 * 点击审核
		 * @param {Object} member 成员信息
		 * @param {Number} i 下标
		 * @param {Boolean} type 是否通过
		 */
		onclickCheck(member,i,type)
		{
			this.gShowModal(type ? "确认通过该成员加入团队?" : "确认拒绝该成员加入团队?",() => {
				checkApply({
					teamId: member.tid,
					memberId: member.uid,
					state: type ? 1 : 2
				})
				this.gToastMsg(type ? "已同意加入" : "已拒绝加入")
				this.$emit("checked",{
					member,
					i,
					type
				})
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.apply-list .content
	width 85%
	border-radius 8px
	.close
		position absolute
		right 10px
		top 5px
		font-size 40rpx
		transform rotate(45deg)
	.members
		height 60vh
		overflow-y auto
	.member
		margin 10px 0
		padding-bottom 5px
		border-bottom var(--border2)
		&:last-of-type
			border-bottom none
		.main
			display flex
			.right
				flex 1
				margin-left 10px
			.name, .time, .btns
				display flex
				.label
					margin-right 2px
					font-weight 700
				.val
					color var(--origin1)
				.btn
					margin 0 10px 0 0
					line-height 1
					padding 4px 20px
					border-radius 8px
					&.refuse
						background-color var(--gray2)
</style>
