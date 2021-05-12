<!-- 资源分享 -->
<template>
	<view class="up-project">
		<BaseInfo ref="baseInfo" v-show="step === 0" :projectId="projectId" showAnonymous></BaseInfo>
		<FileInfo ref="fileInfo" v-show="step === 1" :projectId="projectId" :level="awardLevel"></FileInfo>
		<MemberInfo ref="memberInfo" v-show="step === 2" :projectId="projectId"></MemberInfo>
		<view class="btn">
			<!-- step0 只能进行下一步 -->
			<button v-if="step === 0" @click="createResource">添加附件</button>
			<!-- step1 可选择添加队员 -->
			<button v-if="step === 1" @click="postFiles">添加队员</button>
			<!-- step2 可返回添加附件 -->
			<button v-if="step === 2" @click="putMembers">完成</button>
		</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
/* 引入上传3步 */
import BaseInfo from './components/ProjectBase.vue';
import FileInfo from './components/ProjectFile.vue';
import MemberInfo from './components/ProjectMember.vue';
import { getPublicSignature, postProject, postResource,putMembers } from '@/static/request/api_project.js';
export default {
	data() {
		return {
			step: 0,
			projectId: null,
			awardLevel: null
		};
	},
	onShow() {
		/* 判断用户是否签署合同，若为签署则跳转签署界面 */
		if (!getApp().globalData.gUserInfo.signedContract) {
			uni.navigateTo({
				url: '/pages/Self/Number/Contract',
				success: () => {
					this.gToastError('请先签署合同');
				}
			})
			return
		}
		/* 判断是否需要更新介绍编辑 */
		if(this.step === 0 && this.$refs.baseInfo.editMD){
			this.$refs.baseInfo.intro = getApp().globalData.gEditContent
			this.$refs.baseInfo.editMD = false
		}
	},
	components: {
		BaseInfo,
		FileInfo,
		MemberInfo
	},
	methods: {
		/* 
            name: 创建项目资源
            desc: 获取资源基本信息，上传头像和证明图片后，调用接口创建一个项目
        */
		createResource() 
		{
			const base = this.$refs.baseInfo;
			/* 赛事类型和获奖等级需要转化成数值 */
			this.awardLevel = base.awardLevel ? base.awardLevel.value : null
			/* 计算compId */
			let compId = getApp().globalData.garr_competitions.find(item => item.name === base.compName)
			compId = compId ? compId.id : 0
			
			compId = compId ? compId : 0;
			let data = {
				isAnonymous: base.isAnonymous,
				name: base.name,
				avatarUrl: base.avatarUrl,
				compId,
				tags: base.tags,
				compName: base.compName,
				awardLevel: this.awardLevel,
				awardTime: base.awardTime,
				awardProveUrl: base.awardProveUrl,
				intro: base.intro,
			}
			console.log(data)
			/* 空值检验 */
			if (data.name === '') {
				this.gToastError('请输入资源标题');
				return false;
			}
			else if(!data.compName){
				this.gToastError('请输入获奖信息');
				return false;
			}
			else if(!data.awardLevel){
				this.gToastError('请输入获奖等级');
				return false;
			}
			else if(!data.awardTime){
				this.gToastError('请输入获奖时间');
				return false;
			}
			else if(!data.isAnonymous && !data.awardProveUrl){
				this.gToastError('请选择证明材料');
				return false;
			}
			this.gLoading(this, true)
			// Promise链式结构
			let upImg = Promise.resolve()
			/* 上传头像*/
			if (data.avatarUrl) {
				upImg = upImg.then(() => {
					return getPublicSignature(`${Date.now()}.JPG`)
							.then(sign => sign)
							.catch(err => {
								console.log(err);
								this.gToastError('头像上传失败')
							})
				})
				upImg = upImg.then((sign) => {
					return this.gUploadFile(data.avatarUrl, sign.data)
							.then((res) => {
								console.log("头像上传成功")
								data.avatarUrl = res.header.Location
							})
							.catch(err => {
								console.log(err);
								this.gToastError('头像上传失败')
							})
				})
			}
			if(data.awardProveUrl){
				/* 上传证明 */
				upImg = upImg.then(() => {
					return getPublicSignature(`${Date.now()}.JPG`)
							.then(sign => sign)
							.catch(err => {
								this.gToastError('证明上传失败')
							})
				})
				upImg = upImg.then((sign) => {
					return this.gUploadFile(data.awardProveUrl, sign.data)
							.then(res => {
								console.log("证明上传成功");
								data.awardProveUrl = res.header.Location
							})
							.catch(err => {
								this.gToastError('证明上传失败')
							})
				})
			}
			upImg.then(() => {
				postProject(data)
				.then(res => {
					this.projectId = res.data
					/* 进入下一步*/
					this.step = 1
					this.gLoading(this, false)
					/* 创建项目默认成员 */
					this.$nextTick(() => {
						const me = getApp().globalData.gUserInfo.userInfo
						this.$refs.memberInfo.sureMember({
							type: 2,
							member: {
								memberUserId: me.userId,
								nickname: me.nickname,
								avatarUrl: me.avatarUrl,
								job: "负责人",
								editable: true,
								memberIndex: -1
							}
						})
					})
				})
				.catch(err => {
					this.gLoading(this, false)
				})
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
			let correct = true;
			this.$refs.fileInfo.files.find(file => {
				if (file.status === 0) {
					correct = false;
					return true;
				}
			});
			/* 含未上传文件 */
			if (!correct) {
				this.$refs.fileInfo.upload();
				return;
			}
			// 匿名资源无需添加成员
			if(this.$refs.baseInfo.isAnonymous){
				this.finish();
			}
			else{
				this.step = 2
			}
		},
		/* 
			name: 更新队员信息
			desc: 更新项目的队友信息
			time: 2020/11/15
		*/
		putMembers() 
		{
			this.gLoading(this, true);
			const data = this.$refs.memberInfo.members.map((item, i) => {
				return {
					memberUserId: item.memberUserId,
					rank: i + 1,
					job: item.job,
					editable: item.editable
				};
			});
			putMembers(this.projectId, data)
			.then(res => {
				this.finish();
			})
			.catch(err => {
				this.gLoading(this, false);
			});
		},
		/* 
			name: 完成创建
			desc: 完成项目创建，跳转个人项目管理界面
			time: 2020/11/16
		*/
		finish() 
		{
			this.gToastSuccess('项目创建成功!', true);
			setTimeout(() => {
				uni.navigateBack({
					delta: 1
				});
			}, 1000);
			this.gLoading(this, false);
		}
	}
};
</script>

<style lang="stylus">
.up-project
	position relative
	min-height 96vh
	padding 10px 0
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
			margin 0 15%
			padding 0
			flex 1
			background-color #FFFFFF
			color var(--origin2)
			font-size 30rpx
			font-weight 600
	/* 每个模块共同样式 */
	.content
		margin 0 20rpx 66px
		padding 10px 20px
		background-color #FFFFFF
		border-radius 22px
		/* 大标题 */
		.h3
			padding 20rpx 0
			color var(--origin2)
		/* 输入框 */
		.input-info
			margin 15rpx 0
		/* 备注信息 */
		.remark
			color var(--origin2)
			font-size 20rpx
</style>
