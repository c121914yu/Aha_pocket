<template>
  <view class="content">
    <view class="h3">添加成员</view>
    <view class="search">
      <input type="text" placeholder="添加队友" v-model="searchText"/>
      <text class="iconfont icon-sousuo" @click="search"></text>
    </view>
    <drawList 
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
import drawList from "../components/drawList.vue"
import SetMember from "../components/SetMember.vue"
import { postMember,putMember,deleteMember } from "@/static/request/api_project.js"
export default {
  data() {
		const userInfo = getApp().globalData.gUserInfo
    return {
      searchText: "",
			memberInfo: null,
      members: [{
				memberPhone: userInfo.phone,
        nickname: userInfo.userInfo.nickname,
				trueName: userInfo.userInfo.trueName,
        avatarUrl: userInfo.userInfo.avatarUrl,
				school: userInfo.userInfo.school,
				job: "",
				editable: false,
				memberIndex: 0,
      }],
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
			/* 搜索用户 */
      this.memberInfo = {
				memberPhone: this.searchText,
        nickname: "edagf",
				trueName: "余金隆",
        avatarUrl: getApp().globalData.gUserInfo.userInfo.avatarUrl,
				school: "浙江工业大学",
				job: "",
				editable: false,
				memberIndex: -1, // -1代表新成员
      }
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
			/* 0关闭，1删除，2确认修改 */
			if(e.type === 0)
				this.memberInfo = null
			else if(e.type === 1){
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
					projectId: 5,
					memberPhone: e.member.memberPhone,
					nickname: e.member.nickname,
					nickname: e.member.nickname,
					trueName: e.member.trueName,
					avatarUrl: e.member.avatarUrl,
					school: e.member.school,
					job: e.member.job,
					rank: this.members.length+1,
					editable: e.member.editable,
				}
				postMember(this.projectId,data)
				.then(res => {
					this.members.push(data)
					this.$refs.drawList.tempList.push(data)
					this.searchText = ""
					this.memberInfo = null
					this.gToastSuccess("添加成员成功!")
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
