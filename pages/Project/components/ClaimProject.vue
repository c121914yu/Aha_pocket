<!-- 
	认领匿名资源弹窗
	author yjl
 -->
<template>
	<view 
		class="claim-project fix-screen"  
		@touchmove.stop.prevent 
		@click="$emit('close')">
		<view class="content" @click.stop>
			<view class="h3 center">{{applyingID > 0 ? "修改申请材料" : "申请认领项目"}}</view>
			<!-- 选择文件 -->
			<view class="prove">
				<text class="label">证明材料：</text>
				<button 
					v-if="!awardProveUrl.val" 
					@click="chooseImage">
					选择证明<text class="iconfont icon-tianjia"></text>
				</button>
				<image 
					v-else 
					:src="awardProveUrl.val" 
					mode="widthFix" 
					@click="onclickImg">
				</image>
			</view>
			<!-- 描述文字 -->
			<textarea placeholder="一些描述文字..."  v-model="intro"/>
			<!-- 确认 -->
			<button class="apply" @click="onclickSure">
				{{applyingID > 0 ? "修改申请" : "申请认领"}}
			</button>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { postApplyProject,putApplyProject } from "@/static/request/api_project.js"
import { getPublicSignature } from "@/static/request/api_system.js"
export default {
	props: {
		projectId: Number,
		applyingID: Number
	},
	data() {
		return {
			awardProveUrl: {
				val: "",
				errMsg: "请选择证明材料"
			},
			intro: ""
		};
	},
	methods: {
		/**
		 * 选择图片
		 */
		async chooseImage() 
		{
			const img = await this.gChooseImage()
			this.awardProveUrl.val = img[0]
		},
	    /**
		 * 点击图片，打开menu操作菜单
		 */
		onclickImg() 
		{
			/* 进入操作菜单 */
			this.gMenuPicker(['预览图片', '修改图片', '删除图片'])
			.then(res => {
				switch(res) {
					case "预览图片":
						this.gReadImage([this.awardProveUrl.val])
						break
					case "修改图片":
						this.chooseImage()
						break
					case "删除图片":
						this.gShowModal('确认删除该证明图片?', () => {
							this.awardProveUrl.val = ""
						})
						break
				}
			})
		},
		/**
		 * 点击确认，判断是修改申请还是创建新的申请
		 */
		async onclickSure()
		{
			if(!this.gIsNull([this.awardProveUrl])) {
				this.gShowModal(this.applyingID > 0 ? "确认修改认领材料？" : "确认认领该项目？",async () => {
					try{
						this.gLoading(this, true)
						/* 获取上传签名 */
						let sign = await getPublicSignature(`${Date.now()}.JPG`)
						/* 上传图片 */
						const upImg = await this.gUploadFile(this.awardProveUrl.val, sign.data)
						this.awardProveUrl.val = upImg.header.Location
						/* 更新申请表 */
						if(this.applyingID > 0){
							await putApplyProject({
								applyingID: this.applyingID,
								projectId: this.projectId,
								intro: this.intro,
								awardProveUrl: this.awardProveUrl.val,
								state: 0
							})
						}
						/* 创建申请表 */
						else {
							await postApplyProject({
								applyingID: this.applyingID,
								projectId: this.projectId,
								intro: this.intro,
								awardProveUrl: this.awardProveUrl.val,
								state: 0
							})
						}
						this.gLoading(this, false)
						this.gToastSuccess(this.applyingID > 0 ? "修改申请成功" :"申请认领成功")
						this.$emit("success",1)
					} catch(err) {
						this.gLoading(this,false)
						console.log(err);
						gToastError("申请失败...")
					}
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
