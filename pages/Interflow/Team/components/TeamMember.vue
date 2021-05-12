<!-- 团队成员组件 -->
<template>
	<view 
		:style="{
			'padding': padding
		}"
		class="team-member">
		<view class="title">队长</view>
		<view class="member" @click="$emit('click',obj_captain)">
			<view class="left">
				<aha-avatar :src="obj_captain.memberRoughInfo.avatarUrl" size="50"></aha-avatar>
				<view class="role">{{obj_captain.role || "队长"}}</view>
			</view>
			<view class="right">
				<view class="name strong">{{obj_captain.memberRoughInfo.nickname}}</view>
				<view class="member-intro">
					{{obj_captain.memberIntro || "这个人还没填写介绍"}}
				</view>
			</view>
		</view>
		<view v-if="arr_admin.length>0">
			<view class="title">管理员</view>
			<view
				class="member" 
				v-for="member in arr_admin"
				:key="member.uid"
				@click="$emit('click',member)">
				<view class="left">
					<aha-avatar :src="member.memberRoughInfo.avatarUrl" size="50"></aha-avatar>
					<view class="role">{{member.role || "管理员"}}</view>
				</view>
				<view class="right">
					<view class="name strong">{{member.memberRoughInfo.nickname}}</view>
					<view class="member-intro">
						{{member.memberIntro || "这个人还没填写介绍"}}
					</view>
				</view>
			</view>
		</view>
		<view v-if="arr_teamMembers.length>0">
			<view class="title">成员</view>
			<view
				class="member" 
				v-for="member in arr_teamMembers"
				:key="member.uid"
				@click="$emit('click',member)">
				<view class="left">
					<aha-avatar :src="member.memberRoughInfo.avatarUrl" size="50"></aha-avatar>
					<view class="role">{{member.role || "队员"}}</view>
				</view>
				<view class="right">
					<view class="name strong">{{member.memberRoughInfo.nickname}}</view>
					<view class="member-intro">
						{{member.memberIntro || "这个人还没填写介绍"}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		captainId: {
			type: Number,
			default: 0
		},
		arr_members: {
			type: Array,
			default: () => []
		},
		padding: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			obj_captain: {},
			arr_admin: [],
			arr_teamMembers: []
		}
	},
	created() {
		this.updateMember()
	},
	methods: {
		updateMember()
		{
			this.$nextTick(() => {
				let admin = [],teamMembers = []
				/* 对members进行分类 */
				this.arr_members.forEach(member => {
					if(member.uid === this.captainId){
						this.obj_captain = member
					}
					else if(member.isAdmin) {
						admin.push(member)
					}
					else{
						teamMembers.push(member)
					}
				})
				console.log(this.arr_members)
				this.arr_admin = admin
				this.arr_teamMembers = teamMembers
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.team-member
	.title
		margin-bottom 5px
		padding-left 5px
		line-height 1
		border-left 4px solid var(--origin1)
		color var(--origin1)
	.member
		margin 10px auto
		padding 5px 10px
		border var(--border2)
		border-radius 8px
		display flex
		.left
			.role
				font-size 22rpx
				border-radius 4px
				padding 0 5px
				text-align center
				background-color var(--origin2)
				color #FFFFFF
		.right
			margin-left 10px
			flex 1
			.member-intro
				margin 5px 0
				height 60px
				padding 5px
				border-radius 4px
				background-color var(--origin4)
				font-size 22rpx
</style>
