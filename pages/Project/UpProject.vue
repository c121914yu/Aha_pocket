<!-- 资源分享 -->
<template>
	<view class="up-project">
		<baseInfo ref="baseInfo" v-if="step === 0" :projectId="projectId"></baseInfo>
		<fileInfo ref="fileInfo" v-if="step === 1" :projectId="projectId"></fileInfo>
		<MemberInfo ref="memberInfo" v-if="step === 2" :projectId="projectId"></MemberInfo>
		<view class="btn">
			<!-- step0 只能进行下一步 -->
			<button v-if="step === 0" @click="createResource">添加附件</button>
			<!-- step1 可选择添加队员 -->
			<button v-if="step === 1" @click="postFiles">添加队员</button>
			<!-- step2 可返回添加附件 -->
			<button v-if="step === 2" @click="putMembers">完成</button>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
/* 引入上传3步 */
import baseInfo from './components/ProjectBase.vue';
import fileInfo from './components/ProjectFile.vue';
import MemberInfo from './components/ProjectMember.vue';
import { getPublicSignature, postProject, postResource, putMembers } from '@/static/request/api_project.js';

export default {
	data() {
		return {
			step: 0,
			projectId: null
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
			});
		}
	},
	components: {
		baseInfo,
		fileInfo,
		MemberInfo
	},
	methods: {
		/* 
            name: 创建项目资源
            desc: 获取资源基本信息，上传头像和证明图片后，调用接口创建一个项目
        */
		createResource() {
			this.gLoading(this, true);
			const base = this.$refs.baseInfo;
			/* 赛事类型和获奖等级需要转化成数值 */
			let awardLevel = '';
			getApp().globalData.prizeLevels.find(item => {
				if (item.label === base.awardLevel) {
					awardLevel = item.value;
					return;
				}
			});
			let compId = '';
			getApp().globalData.Competitions.find(item => {
				if (item.name === base.compName) {
					compId = item.compTagId;
					return;
				}
			});
			compId = compId ? compId : 0;
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
			};
			/* 空值检验 */
			if (data.name === '') {
				this.gToastError('请输入资源标题');
				this.gLoading(this, false);
				return false;
			}
			
			let successNum = 0
			const postProj = () => {
				if(successNum < 2){
					return
				}
				postProject(data)
					.then(res => {
						this.projectId = res.data.id;
						/* 进入下一步*/
						this.step = 1;
						this.gLoading(this, false);
					})
					.catch(err => {
						this.gLoading(this, false);
					});
			};
			
			/* 判断是否有需要上传图片 */
			if (!data.avatarUrl && !data.awardProveUrl) {
				successNum = 2
				postProj()
				return
			}
			/* 上传头像*/
			const reg = /\/tmp\//
			if (data.avatarUrl && reg.test(data.avatarUrl)) {
				getPublicSignature(`${Date.now()}.JPG`)
				.then(signature => {
					this.gUploadFile(data.avatarUrl, signature.data)
						.then(url => {
							console.log("头像上传成功");
							data.avatarUrl = url
							successNum++
							postProj()
						})
						.catch(err => {
							this.gToastError('头像上传失败')
							successNum++
							postProj()
						})
				})
				.catch(err => {
					this.gToastError('头像上传失败')
					successNum++
					postProj()
				})
			}
			else{
				successNum++
			}
			
			/* 上传证明 */
			if (data.awardProveUrl && reg.test(data.awardProveUrl)) {
				getPublicSignature(`${Date.now()}.JPG`)
				.then(signature => {
					this.gUploadFile(data.awardProveUrl, signature.data)
						.then(url => {
							console.log("证明上传成功");
							data.awardProveUrl = url
							successNum++
							postProj()
						})
						.catch(err => {
							this.gToastError('证明上传失败')
							successNum++
							postProj()
						})
				})
				.catch(err => {
					this.gToastError('证明上传失败')
					successNum++
					postProj()
				})
			}
			else{
				successNum++
				postProj()
			}
		},
		/* 
			name: 创建资源文件
			desc: 读取上传文件中的文件数据，并根据projectId更新到对应的项目中
			time: 2020/11/15
	  */
		postFiles() {
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
			this.step = 2;
		},
		/* 
			name: 更新队员信息
			desc: 更新项目的队友信息
			time: 2020/11/15
		*/
		putMembers() {
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
		finish() {
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
	/* 每个模块共同样式 */
	.content
		margin 0 20rpx 66px
		padding 10px 20px
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
