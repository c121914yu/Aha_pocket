<!-- 身份验证 -->
<template>
	<view class="authentication">
		<view class="content">
			<view class="head">
				<text class="h3">实名信息</text>
				<text class="state" :class="stateObj.class">*{{stateObj.msg}}</text>
			</view>
			<SelfInput
				label="姓名"
				contentWidth="350rpx"
				circle
				v-model="name">
			</SelfInput>
			<SelfInput
				label="手机号"
				contentWidth="450rpx"
				type="Number"
				circle
				v-model="phone">
			</SelfInput>
			<!-- 身份 -->
			<SelfRadio
				label="当前身份"
				:radio="[
					{label:'学生',value:'学生'},
					{label:'非学生',value:'非学生'}
				]"
				v-model="identify">
			</SelfRadio>
			<!-- 图片 -->
			<view class="proves">
				<!-- 身份证正面 -->
				<view class="item identify-front">
					<image v-if="identifyFront" :src="identifyFront" mode="widthFix" @click="showMenu('identifyFront')"></image>
					<view v-else class="remark" @click="chooseImg('identifyFront')">
						<text class="iconfont icon-tianjia"></text>
						<text>身份证正面图</text>
					</view>
				</view>
				<!-- 身份证反面 -->
				<view class="item identify-front">
					<image v-if="identifyBack" :src="identifyBack" mode="widthFix" @click="showMenu('identifyBack')"></image>
					<view v-else class="remark" @click="chooseImg('identifyBack')">
						<text class="iconfont icon-tianjia"></text>
						<text>身份证反面图</text>
					</view>
				</view>
				<!-- 学生证 -->
				<view v-if="identify === '学生'" class="item identify-front">
					<image v-if="identifyStu" :src="identifyStu" mode="widthFix" @click="showMenu('identifyStu')"></image>
					<view v-else class="remark" @click="chooseImg('identifyStu')">
						<text class="iconfont icon-tianjia"></text>
						<text>学生证/校园卡</text>
					</view>
				</view>
			</view>
			<!-- 提交 -->
			<view class="submit">
				<button @click="submit">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			state: 0, // 0未验证，1验证中，2验证失败，3验证通过
			name: "",
			phone: getApp().globalData.gUserInfo.phone,
			identify: "学生",
			identifyFront: "", //身份证正面
			identifyBack: "", //身份证反面
			identifyStu: "", //学生证
		}
	},
	computed: {
		stateObj(){
			switch(this.state){
				case 0: return{msg:"未验证",class:"unauth"};break;
				case 1: return{msg:"验证中",class:"authing"};break;
				case 2: return{msg:"验证失败",class:"authErr"};break;
				case 3: return{msg:"验证通过",class:"authed"};break;
			}
		}
	},
	methods: {
		/* 选择图片 */
		chooseImg(item)
		{
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success:  (img) => {
					this[item] = img.tempFilePaths[0]
				}
			})
		},
		/*
			name: 进入操作菜单
			desc: 点击图片进入操作菜单，提示修改图片或者预览图片
			input: 输入一个变量的字段
			time: 2020/11/12
		*/
		showMenu(item)
		{
			/* 进入操作菜单 */
			uni.showActionSheet({
				itemList: ['预览图片', '修改图片','删除图片'],
				success: (res) => {
					/* 预览图片 */
					if(res.tapIndex === 0){
						uni.previewImage({
							urls: [this[item]]
						})
					}
					/* 修改图片 */
					else if(res.tapIndex === 1){
						this.chooseImg(item)
					}
					/* 删除图片 */
					else if(res.tapIndex === 2){
						this.gShowModal("确认删除该证明图片?",() => {
							this[item] = ""
						})
					}
				}
			})
		},
		/* 提交事件 */
		submit()
		{
			/* 已通过验证提醒 */
			if(this.state === 3){
				this.gShowModal("重新提交需重新审核。",() => {
					this.prove()
				})
			}
			else{
				this.prove()
			}
		},
		/* 请求上传证明 */
		prove()
		{
			/* 空值检测 */
			if(this.name === ""){
				this.gToastError("姓名为空")
			}
			else if(this.identifyFront === "" || this.identifyBack === ""){
				this.gToastError("身份证明为空")
			}
			else if(this.identify === "学生" && this.identifyStu === ""){
				this.gToastError("学生证明为空")
			}
			else{
				/* 上传图片 */
			}
		}
	}
}
</script>

<style lang="stylus">
.authentication
	min-height 100vh
	padding 15px 5% 65px
	background-color var(--white1)
	.content
		padding 10px 30px
		border-radius 22px
		background-color #FFFFFF
		.head
			margin-bottom 10px
			display flex
			justify-content space-between
			.h3
				color var(--origin1)
			.state
				font-size 24rpx
				font-weight 700
				&.unauth
					color var(--gray1)
				&.authing
					color var(--origin2)
				&.authed
					color #04BE02
				&.authErr
					color #e86452
		.proves
			.item
				margin 5px 0
				width 100%
				min-height 150px
				background-color var(--origin4)
				border 2px solid var(--origin2)
				border-radius 8px
				overflow hidden
				display flex
				align-items center
				justify-content center
				.remark
					color var(--origin1)
					display flex
					flex-direction column
					align-items center
					.iconfont
						font-size 40rpx
			image
				width 100%
		.submit
			position fixed
			bottom 0
			left 0
			right 0
			padding 8px 15%
			background-color var(--origin2)
			border-top-left-radius 22px
			border-top-right-radius 22px
			button
				background-color #FFFFFF
				color var(--origin2)
				padding 2px
</style>
