<template>
	<view class="edit-project">
		<!-- 导航 -->
		<view class="navs">
			<view 
				class="slide-card"
				:style="{
					left: `${pageIndex * 33.3333}vw`
				}">
			</view>
			<view 
				class="nav"
				:class="index === pageIndex ? 'active' : ''"
				v-for="(nav,index) in pages"
				:key="nav"
				@click="pageIndex=index">
				{{nav}}
			</view>
		</view>
		<baseInfo 
			ref="baseInfo"
			v-show="pageIndex === 0">
		</baseInfo>
		<fileInfo 
			ref="fileInfo" 
			v-show="pageIndex === 1" 
			:projectId="project.id">
		</fileInfo>
		<MemberInfo 
			ref="memberInfo" 
			v-show="pageIndex === 2" 
			:projectId="project.id">
		</MemberInfo>
		<view class="btn">
			<button @click="save">保存</button>
		</view>
        <!-- 加载动画 -->
        <Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getPublicSignature,getProject,putProject,putMembers } from "@/static/request/api_project.js"
import baseInfo from "./components/ProjectBase.vue"
import fileInfo from "./components/ProjectFile.vue"
import MemberInfo from "./components/ProjectMember.vue"
export default {
	data() {
		return {
			project: null,
			pages: ["基本信息","附件信息","队员信息"],
			pageIndex: 0
		}
	},
	methods: {
		/* 
			name: 初始化页面信息
			desc: 将project的信息更新对应的组件页面中
		*/
		initPageInfo()
		{
			/* 获取获奖等级名称 */
			let awardLevel = ""
			getApp().globalData.prizeLevels.forEach(item => {
				if(item.value === this.project.awardLevel)
					awardLevel = item.label
			})
			/* 同步基础信息 */
			const domBaseInfo = this.$refs.baseInfo
			domBaseInfo.name = this.project.name
			domBaseInfo.avatarUrl = this.project.avatarUrl
			domBaseInfo.tags = this.project.tags
			domBaseInfo.compName = this.project.compName
			domBaseInfo.awardLevel = awardLevel
			domBaseInfo.awardTime = this.project.awardTime
			domBaseInfo.awardProveUrl = this.project.awardProveUrl
			domBaseInfo.intro = this.project.intro
			/* 同步附件信息 */
			this.$refs.fileInfo.files = this.project.resources.map(file => {
				return {
					...file,
					status: 2,
					progress: 100
				}
			})
			/* 同步成员信息 */
			this.$refs.memberInfo.members = this.project.members.map(item => {
                return {
                    ...item.memberUser,
                    memberUserId: item.memberUser.userId,
                    rank: item.rank,
                    job: item.job,
                    editable: item.editable,
                }
            })
			console.log(this.project)
            this.gLoading(this,false)
		},
		/* 
			name: 保存信息
			desc: 根据不同pageIndex触发不同保存方式
		*/
		save()
		{
			switch(this.pageIndex){
				case 0: this.updateBaseInfo();break;
				case 1: this.updateFiles();break;
				case 2: this.updateMembers();break;
			}
		},
		/* 更新基本信息 */
		updateBaseInfo()
		{
            this.gLoading(this,true)
			const base = this.$refs.baseInfo
			/* 赛事类型和获奖等级需要转化成数值 */
			let awardLevel = ""
			getApp().globalData.prizeLevels.find(item => {
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
			if(data.name === ""){
				this.gToastError("请输入资源标题")
				return
			}
		
			let status = 0
			const putProj = () => {
				if(status === 2){
					putProject(this.project.id,data)
					.then(res => {
						this.gToastSuccess("修改成功")
					})
                    this.gLoading(this,false)
				}
			}
			
			if(data.avatarUrl || data.awardProveUrl)
				  /* 获取上传文件签名*/
				  getPublicSignature()
				  .then(sign => {
				    /* 检查是否是临时路径*/
				    const reg = /\/tmp\//
				    /* 上传头像*/
				    if(data.avatarUrl && reg.test(data.avatarUrl))
				      this.gUploadFile(data.avatarUrl,`avatar/${data.name}`,sign.data)
				      .then(res => {
				        console.log("头像上传成功")
				        data.avatarUrl = res
				        status++
				        putProj()
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
				        putProj()
				      })
				    else{
				      status++
				      putProj()
				    }
				  })
				 else{
				   status = 2
				   putProj()
				 }
		},
		/* 更新附件 */
		updateFiles()
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
			if(correct)
				this.gToastSuccess("更新附件成功")
			else
				this.$refs.fileInfo.upload()
		},
		/* 更新成员信息 */
		updateMembers()
		{
            this.gLoading(this,true)
			const data = this.$refs.memberInfo.members.map((item,i) => {
				return {
					memberUserId: item.memberUserId,
					rank: i+1,
					job: item.job,
					editable: item.editable
				}
			})
			putMembers(this.project.id,data)
			.then(res => {
                this.gLoading(this,false)
				this.gToastSuccess("更新成员成功!")
			})
            .catch(err => {
                this.gLoading(this,false)
            })
		}
	},
	onLoad(e) {
        this.gLoading(this,true)
		getProject(e.id)
		.then(res => {
			this.project = res.data
            this.$nextTick(this.initPageInfo)
		})
        .catch(err => {
            this.gLoading(this,false)
        })
	},
	components: {
		baseInfo,
		fileInfo,
		MemberInfo,
	}
}
</script>

<style lang="stylus">
.edit-project
	position relative
	min-height 96vh
	padding 20rpx 0
	background-color var(--origin3)
	.navs
		z-index 10
		position fixed
		top 0
		width 100%
		padding 10px
		border-radius 22px
		background-color #FFFFFF
		display flex
		align-items center
		justify-content space-around
		overflow hidden
		.nav
			z-index 2
			transition .3s
			&.active
				color #FFFFFF
		.slide-card
			z-index 1
			position absolute
			width calc(100vw / 3)
			height 100%
			background-color var(--origin1)
			opacity 0.8
			border-radius 10px
			transition .3s
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
	/* 每个模块共同样式 */
	.content
		margin 45px 10px 66px
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
