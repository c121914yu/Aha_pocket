<template>
  <view class="content">
    <view class="h3">添加成员</view>
    <view class="search">
      <input type="text" placeholder="添加队友" v-model="searchText"/>
      <text class="iconfont icon-sousuo" @click="search"></text>
    </view>
    <drawList
			v-if="members.length > 0"
			ref="drawList" 
			:list="members" 
			@confirm="members=$event"
			@click="setMember">
		</drawList>
		<SetMember 
			v-if="memberInfo" 
			:memberInfo="memberInfo"
			@sure="sureMember">
		</SetMember>
  </view>
</template>

<script>
import drawList from "./drawList.vue"
import SetMember from "./SetMember.vue"
import { postMember,putMember,deleteMember } from "@/static/request/api_project.js"
import { getUser } from "@/static/request/api_userInfo.js"
export default {
  data() {
    return {
      searchText: "",
			memberInfo: null,
      members: [],
    }
  },
  props: {
    projectId: String
  },
  methods: {
    /* 
      name: 搜索队友
      desc: 将输入内容传送给后台查询相关队员
      input:
            this.searchText: String,搜索文字
      change:
            this.members: Array,队友列表
      time: 2020/11/15
    */
    search()
    {
			if(this.searchText === "")
				return
			/* 判断是否已经在成员列表中 */
			const judge = this.members.find(item => item.memberPhone === this.searchText)
			if(judge){
				this.gToastError("改成员已存在")
				return
			}
			/* 搜索用户 */
			getUser(this.searchText)
			.then(res => {
				const data = res.data
				this.memberInfo = {
					memberPhone: this.searchText,
				  nickname: data.nickname,
				  avatarUrl: data.avatarUrl || "https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png",
					job: "",
					editable: false,
					memberIndex: -1, // -1代表新成员
				}
			})
    },
		/* 
			name: 设置成员信息
			desc: 点击排序列表，进入成员信息编辑界面
			input:
						index: Number,成员下标列表
			time: 2020/11/16
		*/
	  setMember(index)
		{
			this.memberInfo = {
				...this.members[index],
				memberIndex: index
			}
			console.log(this.memberInfo);
		},
		sureMember(e)
		{
			/* 0关闭，1删除，2确认修改/添加 */
			if(e.type === 0)
				this.memberInfo = null
			else if(e.type === 1){
				if(this.members.length === 1){
					this.gToastError("成员不能为空")
					return
				}
				deleteMember(this.projectId,e.member.memberPhone)
				.then(res => {
					this.members.splice(e.member.memberIndex,1)
					this.$refs.drawList.tempList.splice(e.member.memberIndex,1)
					this.gToastSuccess("删除成功")
					this.memberInfo = null
				})
			}
			/* 新成员 */
			else if(e.member.memberIndex === -1){
				const data = {
					memberPhone: e.member.memberPhone,
					job: e.member.job,
					rank: this.members.length+1,
					editable: e.member.editable,
				}
				// console.log(data);
				postMember(this.projectId,data)
				.then(res => {
					this.members.push({
						...data,
						nickname: e.member.nickname,
						avatarUrl: e.member.avatarUrl
					})
					setTimeout(() => {
						this.$refs.drawList.tempList = JSON.parse(JSON.stringify(this.members))
						this.searchText = ""
						this.memberInfo = null
						this.gToastSuccess("添加成员成功!")
					})
				})
			}
			/* 修改成员 */
			else{
				putMember(this.projectId,e.member.memberPhone,{
					rank: e.member.memberIndex+1,
					job: e.member.job,
					editable: e.member.editable,
				})
				.then(res => {
					this.members[e.member.memberIndex] = e.member
					this.$refs.drawList.tempList[e.member.memberIndex] = e.member
					this.searchText = ""
					this.memberInfo = null
				})
			}
		}
  },
	created() {
		if(this.projectId){
			/* 创建者默认为负责人 */
			const userInfo = getApp().globalData.gUserInfo
			const data = {
				memberPhone: userInfo.phone,
				nickname: userInfo.userInfo.nickname,
				trueName: userInfo.userInfo.trueName,
				avatarUrl: userInfo.userInfo.avatarUrl,
				school: userInfo.userInfo.school,
				job: "负责人",
				editable: true,
				memberIndex: -1,
			}
			this.sureMember({
				type: 2,
				member: data
			})
		}
	},
  components: {
    drawList,
		SetMember
  }
}
</script>

<style lang="stylus" scoped>
.search
  position relative
  border 1px solid var(--origin2)
  border-radius 10px
  display flex
  align-items center
  input
    flex 1
    padding-right 40px
  .iconfont
    position absolute
    right 10px
    font-size 40rpx
    color var(--origin2)
</style>
