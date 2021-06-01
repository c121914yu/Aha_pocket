<!-- 
	上传项目
	author yjl
 -->
<template>
	<view class="up-project">
		<base-info ref="baseInfo" is_created></base-info>
		<btn-bottom @click="onclickCreate">
			创建项目
		</btn-bottom>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
/* 引入上传3步 */
import BaseInfo from './components/ProjectBase.vue';
import { getPublicSignature, postProject,postMember } from '@/static/request/api_project.js';
export default {
	components: {
		"base-info": BaseInfo
	},
	onLoad() {
		/* 判断用户是否签署合同，若为签署则跳转签署界面 */
		if (!getApp().globalData.gUserInfo.signedContract) {
			uni.navigateTo({
				url: '/pages/Self/Number/Contract',
				success: () => {
					this.gToastMsg('请先签署合同');
				}
			})
		}
	},
	onShow() {
		/* 更新介绍文本 */
		if(getApp().globalData.gEditContent) {
			this.$refs.baseInfo.intro = getApp().globalData.gEditContent
		}
	},
	methods: {
	    /**
		 * 点击创建项目，获取组件信息
		 */
		async onclickCreate() 
		{
			const base = this.$refs.baseInfo;
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
					/* 上传头像 */
					if (data.avatarUrl) {
						const sign = await getPublicSignature(`avatar-${Date.now()}.JPG`)
						const upRes = await this.gUploadFile(data.avatarUrl, sign.data)
						data.avatarUrl = upRes.header.Location
					}
					/* 上传证明 */
					const sign = await getPublicSignature(`awardProve-${Date.now()}.JPG`)
					const upRes = await this.gUploadFile(data.awardProveUrl, sign.data)
					data.awardProveUrl = upRes.header.Location
				} catch(e) {
					console.log(e)
					this.gToastError("上传图片失败")
					this.gLoading(this, false)
					return
				}
				/* 创建项目 */
				try {
					const projectId = (await postProject(data)).data
					/* 创建项目默认成员 */
					await postMember({
						projectId,
						memberUserId: getApp().globalData.gUserInfo.userInfo.userId,
						rank: 1,
						job: "负责人",
						editable: true
					})
					uni.redirectTo({
						url: `./EditProject?id=${projectId}`,
						success: () => {
							this.gToastSuccess("创建项目成功!")
						}
					})
				} catch(e) {
					console.log(e)
					this.gToastError("项目创建失败")
				}
				this.gLoading(this, false)
			}
		}
	}
};
</script>

<style lang="stylus">
.up-project
	position relative
	min-height 100vh
	padding 10px 0
	background-color var(--origin4)
	/* 每个模块共同样式 */
	.content
		margin 0 20rpx 66px
		padding 10px 20px
		background-color #FFFFFF
		border-radius 22px
</style>
