<!-- 团队成员组件 -->
<template>
	<view 
		:style="{
			'padding': padding
		}"
		class="team-member">
		<view class="title">队长</view>
		<view class="member" @click="$emit('click',captain)">
			<view class="left">
				<Avatar :src="captain.memberRoughInfo.avatarUrl" size="50"></Avatar>
				<view class="role">{{captain.role || "队长"}}</view>
			</view>
			<view class="right">
				<view class="name strong">{{captain.memberRoughInfo.nickname}}</view>
				<view class="member-intro">
					{{captain.memberIntro || "这个人还没填写介绍"}}
				</view>
			</view>
		</view>
		<view v-if="admin.length>0">
			<view class="title">管理员</view>
			<view
				class="member" 
				v-for="member in admin"
				:key="member.uid"
				@click="$emit('click',member)">
				<view class="left">
					<Avatar :src="member.memberRoughInfo.avatarUrl" size="50"></Avatar>
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
		<view v-if="teamMembers.length>0">
			<view class="title">成员</view>
			<view
				class="member" 
				v-for="member in teamMembers"
				:key="member.uid"
				@click="$emit('click',member)">
				<view class="left">
					<Avatar :src="member.memberRoughInfo.avatarUrl" size="50"></Avatar>
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
		members: {
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
			captain: {},
			admin: [],
			teamMembers: []
		}
	},
	created() {
		this.updateMember(this.members)
	},
	methods: {
		updateMember(members)
		{
			let admin = [],teamMembers = []
			/* 对members进行分类 */
			members.forEach(member => {
				if(member.uid === this.captainId){
					this.captain = member
				}
				else if(member.isAdmin) {
					admin.push(member)
				}
				else{
					teamMembers.push(member)
				}
			})
			console.log(this.members);
			this.admin = admin
			this.teamMembers = teamMembers
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
