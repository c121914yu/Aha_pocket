<template>
	<view class="project-member content">
		<view class="h3">添加成员</view>
		<view class="search">
			<input 
				class="input"
				type="number" 
				placeholder="输入队友的ID" 
				v-model="searchText"/>
			<text class="iconfont icon-jia" @click="onclickAddMember"></text>
		</view>
		<draw-list 
			ref="drawList" 
			:list="arr_members" 
			@confirm="confirmSort" 
			@click="memberInfo = arr_members[$event]">
		</draw-list>
		<set-member 
			v-if="memberInfo" 
			:memberInfo="memberInfo" 
			@close="memberInfo=null"
			@update="updateMember"
			@remove="removeMember">
		</set-member>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import drawList from './drawList.vue';
import SetMember from './SetMember.vue';
import { postMember, putMember, deleteMember } from '@/static/request/api_project.js';
import { getUser } from '@/static/request/api_userInfo.js';
export default {
	components: {
		"draw-list": drawList,
		"set-member": SetMember
	},
	props: {
		projectId: String
	},
	data() {
		return {
			searchText: '',
			memberInfo: null,
			arr_members: []
		};
	},
	methods: {
		/**
		 * 初始化数据
		 */
		initData(members)
		{
			members.sort((a,b) => a.rank - b.rank)
			this.arr_members = members.map(item => ({
				...item.memberUser,
				memberUserId: item.memberUser.userId,
				rank: item.rank,
				job: item.job,
				editable: item.editable,
			}))
			this.$refs["drawList"].initSort(this.arr_members)
			console.log(this.arr_members);
		},
	    /**
		 * 点击添加成员，并跳出弹窗添加成员进队伍
		 */
		onclickAddMember() 
		{
			if (this.searchText === ''){
				return
			} 
			/* 判断是否已经在成员列表中 */
			const judge = this.arr_members.find(item => item.memberUserId === +this.searchText)
			if (judge) {
				this.gToastError('改成员已存在')
				return
			}
			this.gLoading(this, true)
			/* 搜索用户 */
			getUser(this.searchText)
			.then(res => {
				const data = res.data
				if (data) {
					const member = {
						memberUserId: this.searchText,
						nickname: data.nickname,
						avatarUrl: data.avatarUrl,
						job: '',
						editable: false,
						rank: this.arr_members.length + 1,
						userId: +this.searchText
					}
					postMember({
						projectId: this.projectId,
						memberUserId: member.memberUserId,
						rank: member.rank,
						job: member.job,
						editable: member.editable,
					})
					this.arr_members.push(member)
					this.$refs["drawList"].initSort(this.arr_members)
					this.gToastMsg("添加成功")
					this.searchText = ""
				} else {
					this.gToastError('用户不存在')
				}
			})
			.finally(() => this.gLoading(this, false))
		},
		/**
		 * 更新成员信息
		 * @param {Object} e
		 */
		updateMember(member)
		{
			putMember({
				projectId: this.projectId,
				userId: member.userId,
				rank: member.rank,
				job: member.job,
				editable: member.editable
			})
			const index = this.arr_members.findIndex(item => item.userId === member.userId)
			this.arr_members[index] = member
			this.$refs["drawList"].initSort(this.arr_members)
			this.memberInfo = null
			this.gToastMsg("更新成功")
		},
		/**
		 * 删除成员
		 * @param { Number } id 成员ID
		 */
		removeMember(id)
		{
			if (this.arr_members.length === 1) {
				this.gToastMsg('成员不能为空')
				return
			}
			deleteMember({
				projectId: this.projectId,
				userId: id
			})
			const index = this.arr_members.findIndex(item => item.userId === id)
			this.arr_members.splice(index, 1)
			this.$refs["drawList"].initSort(this.arr_members)
			this.memberInfo = null
			this.gToastMsg("删除成功")
		},
		/**
		 * 确认排序顺序
		 */
		confirmSort(members)
		{
			this.arr_members = members.map((item,i) => ({
				...item,
				rank: i+1
			}))
		}
	}
}
</script>

<style lang="stylus" scoped>
.project-member
	.search
		position relative
		margin 5px 0
		border 1px solid var(--origin2)
		border-radius 8px
		display flex
		align-items center
		.input
			flex 1
			padding-right 40px
		.iconfont
			position absolute
			right 10px
			font-size 40rpx
			color var(--origin2)
</style>
