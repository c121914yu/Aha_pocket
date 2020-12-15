<!-- 合同 & 电子前面 -->
<template>
	<view class="contract">
		<view class="center h3">Aha口袋用户合同</view>
		<view class="content" v-if="!showSign">
			<view class="strong">一、总则</view>
			<view>Aha口袋是面向浙江工业大学在读学生的科研项目及衍生孵化作品分享平台，主要运营模式是由用户在本平台上传资源，继而由平台对上传内容在一定范围内进行资源共享，以实现浙江工业大学相关科研项目的可持续发展，满足浙江工业大学在校师生和校友的科研需求。本合同手写部分与打印部分具有相同效力。</view>
			<view>（1）甲方为乙方提供上传空间及在线分享渠道，并基于上传资源价值给予乙方平台贡献点，乙方向甲方提供上传资源。</view>
			<view>（2）所涉上传资源知识产权由甲方、乙方双方共有，乙方许可甲方享有对上传资源的编辑权限及一定范围内的使用权限（包括在资源上增加水印、开放平台阅读复制权限）。</view>
			<view>（3）乙方上传资源能够获得的平台贡献点以本合同规定为准。</view>
			<view>（4）平台贡献点获得方式及使用方式、乙方上传资源所能获得的贡献点值由本平台拟定，具体判断标准如下：\n&emsp;&emsp;用户可上传的资源类型为PPT、文档、论文、成果演示、竞赛心得，用户上传的资源通过分类和获奖等级赋予不同的贡献点值。</view>
			<view class="name">
				姓名: <input type="text" v-model="name">
			</view>
			<view class="signature-view">
				签名：
				<image 
					v-if="signUrl" 
					:src="signUrl" 
					mode="widthFix">
				</image>
			</view>
		</view>
		<button style="background-color: #5d7092;" @click="showSign = true">进入签名</button>
		<button v-if="signUrl" @click="confirm">确认</button>
		<Signature 
			v-if="showSign"
			@confirm="confirmSign">
		</Signature>
	</view>
</template>

<script>
import Signature from "./components/Signature.vue"
export default {
	data() {
		return {
			signedNotice: false,
			showSign: false,
			signUrl: "",
			name: ""
		}
	},
	methods: {
		/* 
			name: 签名完成
			desc: 签名完成，获取签名图片url并展示在界面
			input:
						url: String,签名URL
		*/
		confirmSign(url)
		{
			this.signUrl = url
			this.showSign = false
		},
		/* 
			name: 确认签署
			desc: 确认签署合同，将签名图片发送会后台.
		*/
		confirm()
		{
			uni.showLoading({
				title: "请求中"
			})
			if(this.name === "")
			{
				this.gToastError("请输入姓名")
				return
			}
			uni.uploadFile({
				url: getApp().globalData.baseUrl + "/sign/contract",
				filePath: this.signUrl,
				name: "file",
				header: {
					'Authorization': uni.getStorageSync("token")
				},
				formData: {
					name: this.name,
				},
				success: (res) => {
					const data = JSON.parse(res.data)
					uni.setStorageSync("token",data.data.token)
					getApp().globalData.gUserInfo.signedContract = true
					uni.navigateBack({
						delta: 1,
						success: () => {
							this.gToastSuccess(data.msg)
						}
					})
				},
				fail: (err) => {
					console.log(err)
				}
			})
		}
	},
	components:{
		Signature
	}
}
</script>

<style lang="stylus" scoped>
.contract
	min-height 100
	padding 10px
	white-space pre-wrap
	.content
		font-size 30rpx
		text-indent 60rpx
	.name,.signature-view
		margin-bottom 5px
		white-space nowrap
		display flex
		align-items center
		input
			margin-left 10px
			border-bottom 1px solid var(--gray1)
			border-radius 0
		image
			width 150rpx
	button
		margin 10px 0
		color #FFFFFF
		background-color var(--origin2)
</style>
