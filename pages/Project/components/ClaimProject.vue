<template>
	<view class="claim-project fix-screen"  @touchmove.stop.prevent @click="$emit('close')">
		<view class="content" @click.stop>
			<view class="h3 center">{{applyingID > 0 ? "修改申请材料" : "申请认领项目"}}</view>
			<!-- 选择文件 -->
			<view class="prove">
				<text class="label">证明材料：</text>
				<button v-if="!awardProveUrl" @click="chooseImg">选择证明<text class="iconfont icon-tianjia"></text></button>
				<image v-else :src="awardProveUrl" mode="widthFix" @click="showMenu"></image>
			</view>
			<!-- 描述文字 -->
			<textarea placeholder="一些描述文字..."  v-model="intro"/>
			<!-- 确认 -->
			<button class="apply" @click="apply">{{applyingID > 0 ? "修改申请" : "申请认领"}}</button>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getPublicSignature,postApplyProject,putApplyProject } from "@/static/request/api_project.js"
export default {
	props: {
		projectId: Number,
		applyingID: Number
	},
	data() {
		return {
			awardProveUrl: null,
			intro: ""
		};
	},
	methods: {
		/* 选择图片 */
		chooseImg() 
		{
			uni.chooseImage({
				count: 1, //默认9
				success: img => {
					this.awardProveUrl = img.tempFilePaths[0];
				}
			});
		},
		/* 
			name: 进入操作菜单
			desc: 点击图片进入操作菜单，提示修改图片或者预览图片
			input: 输入一个变量的字段
			time: 2020/11/12
		*/
		showMenu() 
		{
			/* 进入操作菜单 */
			uni.showActionSheet({
				itemList: ['预览图片', '修改图片', '删除图片'],
				success: res => {
					/* 预览图片 */
					if (res.tapIndex === 0) {
						uni.previewImage({
							urls: [this.awardProveUrl]
						});
					} 
					/* 修改图片 */
					else if (res.tapIndex === 1) {
						this.chooseImg();
					} 
					/* 删除图片 */
					else if (res.tapIndex === 2) {
						this.gShowModal('确认删除该证明图片?', () => {
							this.awardProveUrl = null;
						});
					}
				}
			});
		},
		apply()
		{
			if(!this.awardProveUrl){
				this.gToastError("请选择证明材料")
			}
			else{
				this.gLoading(this, true)
				let upImg = Promise.resolve()
				this.gShowModal(this.applyingID > 0 ? "确认修改认领材料？" : "确认认领该项目？",() => {
					upImg = upImg.then(() => {
						return getPublicSignature(`${Date.now()}.JPG`)
								.then(sign => sign)
								.catch(err => {
									console.log(err);
									this.gToastError('证明上传失败')
								})
					})
					upImg = upImg.then((sign) => {
						return this.gUploadFile(this.awardProveUrl, sign.data)
								.then(res => {
									this.awardProveUrl = res.header.Location
									console.log("证明上传成功");
								})
								.catch(err => {
									this.gToastError('证明上传失败')
								})
					})
					upImg.then(() => {
						let p
						if(this.applyingID > 0){
							p = putApplyProject({
								applyingID: this.applyingID,
								projectId: this.projectId,
								intro: this.intro,
								awardProveUrl: this.awardProveUrl,
								state: 0
							})
						}
						else{
							p = postApplyProject({
								applyingID: this.applyingID,
								projectId: this.projectId,
								intro: this.intro,
								awardProveUrl: this.awardProveUrl,
								state: 0
							})
						}
						p.then(res => {
							console.log(res);
							this.gLoading(this, false)
							this.gToastSuccess(this.applyingID > 0 ? "修改申请成功" :"申请认领成功")
							this.$emit("success",1)
						})
						.catch(err => {
							this.gLoading(this, false)
							this.gToastError('申请认领错误')
						})
					})
				})
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.claim-project
	.content
		width 90%
		border-radius 8px
		.h3
			color var(--black)
		/* 证明材料 */
		.prove
			margin 10px 0
			display flex
			align-items center
			button
				margin 0 0 0 10px
				padding 0 10px
				line-height 1.5
				border-radius 8px
				display flex
				align-items center
				.iconfont
					margin-left 5px
					color #FFFFFF
					font-size 40rpx
			image
				width 80px
				max-height 120px
				border var(--border2)
				border-radius 8px
		textarea
			width 100%
			border var(--border2)
			border-radius 8px
		.apply
			margin-top 10px
			border-radius 22px
</style>
