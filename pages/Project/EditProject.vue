<!-- 
	项目编辑
	author yjl
 -->
<template>
	<view class="edit-project">
		<!-- 导航 -->
		<view class="navs">
			<top-navs
				:navs="navs" 
				backgroundColor="#FFFFFF"
				@navChange="pageIndex=$event.value">
			</top-navs>
		</view>
		<base-info 
			ref="baseInfo"
			v-show="pageIndex === 0"
			:AnonymousLabel="project.isAnonymous">
		</base-info>
		<file-info 
			ref="fileInfo" 
			v-show="pageIndex === 1" 
			:projectId="project.id"
			:level="project.awardLevel">
		</file-info>
		<member-info 
			ref="memberInfo" 
			v-show="pageIndex === 2" 
			:projectId="project.id">
		</member-info>
		<btn-bottom v-show="pageIndex !== 1" @click="onclickSave">
			保存
		</btn-bottom>
        <!-- 加载动画 -->
        <load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getPublicSignature,getProject,putProject,putMembers } from "@/static/request/api_project.js"
import baseInfo from "./components/ProjectBase.vue"
import fileInfo from "./components/ProjectFile.vue"
import MemberInfo from "./components/ProjectMember.vue"
export default {
	components: {
		"base-info": baseInfo,
		"file-info": fileInfo,
		"member-info": MemberInfo,
	},
	data() {
		return {
			navs: [
				{label: "基本信息",value: 0},
				{label: "附件信息",value: 1},
				{label: "队员信息",value: 2}
			],
			pageIndex: 0,
			project: null
		}
	},
	onLoad(e) {
	    this.gLoading(this,true)
		getProject(e.id)
		.then(res => {
			if(!res.data) {
				this.gBackPage("id无效")
			}
			this.project = res.data
	        this.$nextTick(this.initPageInfo)
		})
	    .finally(err => {
	        this.gLoading(this,false)
	    })
	},
	onShow() {
		if(getApp().globalData.gEditContent) {
			this.$refs.baseInfo.intro = getApp().globalData.gEditContent
		}
	},
	methods: {
		/**
		 * 初始化页面数据
		 */
		initPageInfo()
		{
			console.log(this.project)
			/* 基本信息 */
			this.$refs.baseInfo.initData(this.project)
			/* 文件信息 */
			this.$refs.fileInfo.initData()
			/* 成员 */
			this.$refs.memberInfo.initData(this.project.members)
		},
		/**
		 * 点击保存按键
		 */
		onclickSave()
		{
			switch(this.pageIndex){
				case 0: this.updateBaseInfo();break;
				case 2: this.updateMembers();break;
			}
		},
		/* 更新基本信息 */
		async updateBaseInfo()
		{
			const base = this.$refs.baseInfo
			/* 空值校验 */
			if(!this.gIsNull([
				base.name,
				base.compName,
				base.awardLevel,
				base.awardTime,
				base.awardProveUrl,
			])) {
				this.gLoading(this, true)
				/* 计算compId */
				let compId = getApp().globalData.garr_competitions.find(item => item.name === base.compName.val)
				compId = compId ? compId.id : 0
				let data = {
					isAnonymous: base.isAnonymous,
					name: base.name.val,
					avatarUrl: base.avatarUrl.val,
					compId,
					tags: base.tags,
					compName: base.compName.val,
					awardLevel: base.awardLevel.val ? base.awardLevel.val.value : null,
					awardTime: base.awardTime.val,
					awardProveUrl: base.awardProveUrl.val,
					intro: base.intro,
				}
				console.log(data)
				try {
					/* 上传头像,判断和旧的是否相同 */
					if (data.avatarUrl && data.avatarUrl !== this.project.avatarUrl) {
						const sign = await getPublicSignature(`avatar-${Date.now()}.JPG`)
						const upRes = await this.gUploadFile(data.avatarUrl, sign.data)
						data.avatarUrl = upRes.header.Location
						base.avatarUrl.val = data.avatarUrl
					}
					/* 上传证明 */
					if(data.awardProveUrl !== this.project.awardProveUrl) {
						const sign = await getPublicSignature(`awardProve-${Date.now()}.JPG`)
						const upRes = await this.gUploadFile(data.awardProveUrl, sign.data)
						data.awardProveUrl = upRes.header.Location
						base.awardProveUrl.val = data.awardProveUrl
					}
				} catch(e) {
					console.log(e)
					this.gToastError("上传图片失败")
					this.gLoading(this, false)
					return
				}
				/* 更新项目 */
				try {
					await putProject(this.project.id,data)
					this.gToastSuccess("更新成功!")
				} catch(e) {
					this.gToastError("更新失败!")
					console.log(e)
				}
				this.gLoading(this, false)
			}
		},
		/**
		 * 更新成员信息
		 */
		updateMembers()
		{
            this.gLoading(this,true)
			const members = this.$refs.memberInfo.arr_members.map((member,i) => ({
				memberUserId: member.userId,
				rank: member.rank,
				job: member.job,
				editable: member.editable
			}))
			putMembers({
				projectId: this.project.id,
				members
			})
			.then(res => {
				this.gToastSuccess("更新成员成功")
			})
            .finally(err => this.gLoading(this,false))
		}
	}
}
</script>

<style lang="stylus">
.edit-project
	position relative
	min-height 100vh
	padding 50px 0 10px
	background-color var(--origin4)
	.navs
		z-index 10
		position fixed
		top 0
		left 0
		width 100%
		border-bottom-left-radius 22px
		border-bottom-right-radius 22px
		border-bottom var(--border2)
	/* 每个模块共同样式 */
	.content
		margin 0 10px 66px
		padding 20rpx 60rpx
		background-color #FFFFFF
		border-radius 22px
</style>
