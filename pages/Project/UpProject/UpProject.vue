<!-- 资源分享 -->
<template>
	<view class="up-resource">
		<baseInfo ref="baseInfo" v-if="step === 0" :projectId="projectInfo.projectId"></baseInfo>
		<fileInfo ref="fileInfo" v-if="step === 1" :projectId="projectInfo.projectId"></fileInfo>
		<MemberInfo ref="memberInfo" v-if="step === 2" :projectId="projectInfo.projectId"></MemberInfo>
		<view class="btn">
			<!-- step0 只能进行下一步 -->
			<button v-if="step===0" @click="createResource">添加附件</button>
			<!-- step1 可选择添加队员 -->
			<button v-if="step===1" @click="postFiles">添加队员</button>
			<!-- step2 可返回添加附件 -->
			<button v-if="step===2" @click="putMembers">完成</button>
		</view>
	</view>
</template>

<script>
/* 引入上传3步 */
import baseInfo from "./upResourceBase.vue"
import fileInfo from "./upResourceFile.vue"
import MemberInfo from "./upResourceMember.vue"
import { postProject,postResource } from "@/static/request/api_project.js"

export default {
	data() {
		return {
			step: 0,
			projectInfo: null
		}
	},
	methods: {
		/* 
			name: 创建项目资源
			desc: 获取资源基本信息，调用接口创建一个项目
	  */
	  createResource()
	  {
		  const base = this.$refs.baseInfo
		  const data = {
			  name: base.name,
			  avatarUrl: base.avatarUrl,
			  compId: base.compId,
			  awardName: base.awardName,
			  awardLevel: base.awardLevel,
			  awardTime: base.awardTime,
			  intro: base.intro
		  }
			/* 空值检验 */
			if(data.name === "")
			{
				this.gToastError("请输入资源标题")
				return false
			}
		  
			postProject(data)
		  .then(res => {
			  this.projectInfo = res.data
			  console.log(res.data)
			  /* 进入下一步*/
			  this.step = 1
		  })
	  },
	  /* 
			name: 创建资源文件
			desc: 读取上传文件中的文件数据，并根据projectId更新到对应的项目中
			time: 2020/11/15
	  */
	  postFiles()
		{
			/* 全部正确标志位 */
			let correct = true
			this.$refs.fileInfo.files.find(file => {
				if(file.status === 0){
					correct = false
					return true
				}
			})
			/* 含未上传文件 */
			if(!correct){
				this.$refs.fileInfo.upload()
				return
			}
			this.step = 2
		},
		/* 
			name: 更新队员信息
			desc: 更新项目的队友信息
			time: 2020/11/15
		*/
		putMembers()
		{
			const members = [...this.$refs.memberInfo.members]
			console.log(members)
			this.finish()
		},
		/* 
			name: 发表资源
			desc: 上传证明和附件后向服务器提交表单
			input:
						data: Object,需要提交的数据
		*/
		finish()
		{
			console.log("发布")
		}
	},
	onLoad() {
		/* 判断用户是否签署合同，若为签署则跳转签署界面 */
		if(!getApp().globalData.gUserInfo.signedContract)
		{
			uni.redirectTo({
				url: "../Contract",
				success: () => {
					this.gToastError("请先签署合同")
				}
			})
		}
	},
	components: {
		baseInfo,
		fileInfo,
		MemberInfo,
	}
}
</script>

<style lang="stylus">
.up-resource
	position relative
	min-height 96vh
	padding 20rpx 0
	background-color var(--origin3)
	/* 按键 */
	.btn
		position fixed
		bottom 0
		left 0
		right 0
		padding 20rpx
		border-top-left-radius 22px
		border-top-right-radius 22px
		background-color var(--origin2)
		display flex
		justify-content space-around
		button
			margin 0 20px
			flex 1
			background-color #FFFFFF
			color var(--origin2)
			font-size 30rpx
			font-weight 600
	.content
		margin 0 20rpx 66px
		padding 20rpx 60rpx
		background-color #FFFFFF
		border-radius 22px
		/* 大标题 */
		.h3
			padding 20rpx 0
			color var(--origin1)
		/* 小标题 */
		.h4
			color var(--origin1)
		/* 输入框 */
		.input-info
			margin 15rpx 0
		/* 备注信息 */
		.remark
			color var(--origin2)
			font-size 20rpx
</style>
