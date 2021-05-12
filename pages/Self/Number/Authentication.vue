<!-- 
	身份验证
	author yjl
-->
<template>
	<view class="authentication">
		<view class="content">
			<view class="head">
				<text class="h3">实名信息</text>
				<text class="state" :class="statusObj.class">*{{statusObj.msg}}</text>
			</view>
			<aha-input
				label="姓名"
				contentWidth="350rpx"
				circle
				v-model="trueName.val">
			</aha-input>
			<!-- 身份 -->
			<aha-radio
				label="当前身份"
				:radio="[
					{label:'学生',value:0},
					{label:'非学生',value:1}
				]"
				v-model="type">
			</aha-radio>
			<!-- 图片 -->
			<view class="proves">
				<!-- 身份证正面 -->
				<view class="item identify-front">
					<image 
						v-if="idCardFront" 
						:src="idCardFront" mode="widthFix"
						@click="onclickImg('idCardFront')">
					</image>
					<view v-else class="remark" @click="chooseImg('idCardFront')">
						<text class="iconfont icon-tianjia"></text>
						<text>身份证正面图</text>
					</view>
				</view>
				<!-- 身份证反面 -->
				<view class="item identify-front">
					<image 
						v-if="idCardBack" 
						:src="idCardBack" 
						mode="widthFix" 
						@click="onclickImg('idCardBack')">
					</image>
					<view v-else class="remark" @click="chooseImg('idCardBack')">
						<text class="iconfont icon-tianjia"></text>
						<text>身份证反面图</text>
					</view>
				</view>
				<!-- 学生证 -->
				<view v-if="type === 0" class="item identify-front">
					<image 
						v-if="studentCard" 
						:src="studentCard" 
						mode="widthFix" 
						@click="onclickImg('studentCard')">
					</image>
					<view v-else class="remark" @click="chooseImg('studentCard')">
						<text class="iconfont icon-tianjia"></text>
						<text>学生证/校园卡</text>
					</view>
				</view>
			</view>
			<!-- 提交 -->
			<btn-bottom @click="onclickSubmit">提交</btn-bottom>
		</view>
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getAuthenticationSignature,putAuthentication } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			state: getApp().globalData.gUserInfo.authenticated, // 0未验证，1验证中，2验证失败，3验证通过
			trueName: {
				val: "",
				errMsg: "姓名不能为空"
			},
			type: 0,
			idCardFront: "", //身份证正面
			idCardBack: "", //身份证反面
			studentCard: "", //学生证
		}
	},
	computed: {
		statusObj(){
			switch(this.type){
				case 0: return{msg:"未验证",class:"unauth"};break;
				case 1: return{msg:"验证中",class:"authing"};break;
				case 2: return{msg:"验证失败",class:"authErr"};break;
				case 3: return{msg:"验证通过",class:"authed"};break;
			}
		}
	},
	onLoad() {
		this.gUndesign()
	},
	methods: {
		/**
		 * 选择图片
		 * @param {String} item 变量字段
		 */
		chooseImg(item)
		{
			this.gChooseImage(1,true)
			.then(res => {
				this[item] = res[0]
			})
		},
	   /**
		* 点击图片，打开menu操作菜单
		* @param {String} item 变量字段
		*/
		onclickImg(item)
		{
			/* 进入操作菜单 */
			this.gMenuPicker(['预览图片', '修改图片','删除图片'])
			.then(res => {
				switch(res) {
					case "预览图片":
						this.gReadImage([this[item]])
						break
					case "修改图片":
						this.chooseImg(item)
						break
					case "删除图片":
						this.gShowModal("确认删除该证明图片?",() => {
							this[item] = ""
						})
						break
				}
			})
		},
		/**
		 * 提交实名验证,如果是审核中，则提示是否重新审核。
		 */
		onclickSubmit()
		{
			/* 已通过验证提醒 */
			if(this.state === 3){
				this.gShowModal("重新提交实名认证需重新审核,请确认!",() => {
					this.uploadProve()
				})
			}
			else{
				this.uploadProve()
			}
		},
		/**
		 * 上传证明,校验空值
		 */
		uploadProve()
		{
			/* 空值检测 */
			
			if(!this.gIsNull([this.trueName])){
				this.gLoading(this,true)
				const data = {
					trueName: this.trueName,
					type: this.type,
				}
				const signatures = [
					this.idCardFront,this.idCardBack
				]
				if(this.studentCard){
					signatures.push(this.studentCard)
				}
				/* 获取上传签名 */
				Promise.all(signatures.map(item => getAuthenticationSignature(item.name)))
				.then(res => {
					Promise.all(res.map((item,index) => this.gUploadFile(signatures[index].path,item.data)))
					.then((res) => {
						res.forEach((item,index) => {
							data[signatures[index].key] = signatures[index].name
						})
						console.log(data)
						/* 更新实名认证信息 */
						putAuthentication(data)
						.then(() => {
							this.gToastSuccess("实名认证成功")
						})
						.catch(() => {
							this.gToastError("实名认证失败")
						})
						this.gLoading(this,false)
					})
					.catch(err => {
						this.gToastError("上传图片失败")
						this.gLoading(this,false)
						console.log(err);
					})
				})
				.catch(err => {
					this.gToastError("获取签名错误")
					this.gLoading(this,false)
					console.log(err);
				})
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
