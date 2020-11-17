<!-- 资源分享 -->
<template>
	<view class="up-resource">
		<baseInfo ref="baseInfo" v-if="step === 0" :projectId="projectId"></baseInfo>
		<fileInfo ref="fileInfo" v-if="step === 1" :projectId="projectId"></fileInfo>
		<MemberInfo ref="memberInfo" v-if="step === 2" :projectId="projectId"></MemberInfo>
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
import { getPublicSignature,postProject,postResource,putMembers } from "@/static/request/api_project.js"

export default {
	data() {
		return {
			step: 0,
			projectId: null
		}
	},
	methods: {
		/* 
			name: 创建项目资源
			desc: 获取资源基本信息，上传头像和证明图片后，调用接口创建一个项目
	  */
	  createResource()
	  {
		  const base = this.$refs.baseInfo
      /* 赛事类型和获奖等级需要转化成数值 */
			let awardLevel = ""
      getApp().globalData.prizeGrades.find(item => {
        if(item.label === base.awardLevel){
          awardLevel = item.value
          return
        }
      })
			let compId = ""
      getApp().globalData.Matches.find(item => {
        if(item.name === base.compName){
          compId = item.compTagId
          return
        }
      })
			compId = compId ? compId : 0
		  let data = {
			  name: base.name,
			  avatarUrl: base.avatarUrl,
			  compId,
        tags: base.tags,
			  compName: base.compName,
			  awardLevel,
			  awardTime: base.awardTime,
        awardProveUrl: base.awardProveUrl,
			  intro: base.intro
		  }
			/* 空值检验 */
			if(data.name === "")
			{
				this.gToastError("请输入资源标题")
				return false
			}
      
      let status = 0
      const postProj = () => {
        if(status === 2){
          postProject(data)
          .then(res => {
            this.projectId = res.data.id
            /* 进入下一步*/
            this.step = 1
          })
        }
      }
      
      if(data.avatarUrl || data.awardProveUrl)
        /* 获取上传文件签名*/
        getPublicSignature()
        .then(sign => {
          uni.showLoading({ title: "上传图片中" })
          /* 检查是否是临时路径*/
          const reg = /\/tmp\//
          /* 上传头像*/
          if(data.avatarUrl && reg.test(data.avatarUrl))
            this.gUploadFile(data.avatarUrl,`avatar/${data.name}`,sign.data)
            .then(res => {
              console.log("头像上传成功")
              data.avatarUrl = res
              status++
              postProj()
            })
          else
            status++
          /* 上传证明*/
          if(data.awardProveUrl && reg.test(data.awardProveUrl))
            this.gUploadFile(data.awardProveUrl,`awardProve/${data.name}`,sign.data)
            .then(res => {
              console.log("证明上传成功")
              data.awardProveUrl = res
              status++
              postProj()
            })
          else{
            status++
            postProj()
          }
        })
       else{
         status = 2
         postProj()
       }
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
			const data = this.$refs.memberInfo.members.map((item,i) => {
				return {
					memberPhone: item.memberPhone,
					rank: i+1,
					job: item.job,
					editable: item.editable
				}
			})
			putMembers(this.$refs.memberInfo.members[0].projectId,data)
			.then(res => {
				console.log(res)
				this.finish()
			})
		},
		/* 
			name: 完成创建
			desc: 完成项目创建，跳转个人项目管理界面
			time: 2020/11/16
		*/
		finish()
		{
			this.gToastSuccess("项目创建成功!",true)
			setTimeout(() => {
				uni.redirectTo({
					url: "../MyProject"
				})
			},1000)
			
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
