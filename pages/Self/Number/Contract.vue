<!-- 合同 & 电子前面 -->
<template>
	<view 
		class="contract"
		:class="showSign ? 'unmove' : ''">
		<view class="center h3">Aha 平台知识产权许可使用合同</view>
		<view class="title">
			<view class="item">
				<text>甲方: </text><view class="name">梵帝贸易有限公司</view>
			</view>
			<view class="item">
				<text>乙方: </text><view class="name"></view>
			</view>
		</view>
		<view>
<view class="strong">一、总则</view>
	 Aha口袋是面向浙江工业大学在读学生的科研项目及衍生孵化作品的分享平台，主要运营模式是由用户在本平台上传资源，继而由平台对上传内容在一定范围内进行资源共享，以实现浙江工业大学相关科研项目的可持续发展，满足浙江工业大学在校学生的科研需求。
（1）甲方为乙方提供上传空间及在线分享渠道，并基于上传资源价值给予乙方金钱报酬或者平台贡献点，乙方向甲方提供上传资源。
<view class="red">（2）所涉上传资源的知识产权由乙方以普通许可方式许可甲方于全球范围内在乙方上传之日起至自行删除资源期间内使用且有权再许可给他人并享有再许可目的范围内的相关权限（如文字性编辑、添加标明来源的水印等）</view>
（3）乙方上传资源能够获得的金钱报酬或平台贡献点以本合同规定为准。
（4）平台贡献点获得方式及使用方式、乙方上传资源所能获得的贡献点值由本平台拟定，具体判断标准如下：
用户可上传的资源类型为PPT、文档、论文、成果演示、竞赛心得，用户上传的资源通过分类和获奖等级赋予不同的贡献点值。
		<image
			v-for="(url,index) in contractImg"
			:key="index"
			:src="url" 
			mode="widthFix" 
			@click="readImg(index)">
		</image>
（注：以上区分标签中资源意义位阶划分由平台评审委员会做出，评审委员会由师生组成。)
	为保证意思自治及公平公开原则的实现，评审委员会在做出评审结果后将即时通知乙方，乙方若同意评审结果，甲方将按评审结果确定贡献值并发布资源。
	<view class="indent red">若乙方对评审结果有异议，可以在收到通知后24小时内向平台反馈。未经乙方同意，甲方承诺不会将乙方提供资源上传平台。</view>
（5）本平台的用户范围仅限浙江工业大学在校学生，使用范围仅限于浙江工业大学内，资源范围仅限于浙江工业大学内由学生产生、培育、孵化的相关资源。
<view class="strong">二、甲方权利和义务</view>
（1）甲方有权将乙方提供的资源向平台使用者开放，使用者可以通过充值等手段获得贡献点并按照平台说明使用，乙方不得随意干涉。
（2）甲方有权要求乙方提供资源原创承诺书，对于虚假承诺和违反承诺书造成的侵权行为，甲方原则上不承担任何责任，如甲方需对外承担侵权责任，则保留向乙方追责的权利，由此而造成平台的损失，由乙方承担。
（3）甲方应当遵守相关法律法规及本合同下各项使用规定，否则，乙方有权立即暂停或终止相关许可，并解除本合同，甲方还应当赔偿由此给乙方造成的损失。
（4）甲方对乙方上传资源的适用范围仅限于浙江工业大学在读学生。
（5）甲方可以对乙方提交资源进行添加水印等操作。
（6）甲方负责按照合同约定向乙方支付相应的金钱报酬或者贡献点，甲方逾期三日内未按照本合同约定付款的，乙方有权单方解除合同并追究甲方相关责任。

<view class="strong">三、乙方权利和义务</view>
（1）乙方应当在与甲方约定的期限内，通过自行注册账号成为平台用户的乙方应当在注册平台账号后签署并向甲方提供针对其向甲方提供的资源的原创承诺书，担保其向平台提供的资源为其原创成果，不存在侵犯他人合法权益的情形。乙方向甲方提供侵犯他人知识产权等合法权益的资源的行为以及由乙方提供的资源本身的问题引发的诉讼均与甲方无关，并且甲方有权基于乙方的行为追究乙方的违约责任。若甲方实际上因乙方提供侵犯他人知识产权等合法权益的资源的行为遭受的损失，以及因乙方前述行为参加诉讼有支出的一系列费用，甲方有权要求乙方予以赔偿并且甲方有权追究乙方的违约责任。
（2）乙方应当在与甲方的约定的期限内，通过自行注册账号成为平台用户的乙方应当在注册平台账号后与甲方签署知识产权许可使用协议，乙方应授权平台以一切合理并常规的方式（如加上平台的水印等）对乙方提供的资源进行操作，授权平台向以平台贡献值进行兑换的用户开放阅读和每次不多于50字的复制的权限。
（3）乙方有权在向平台提供其原创资源时按照平台制定的等级规则获得相应的金钱报酬或者在提供资源后按照平台制定资源等级规则以及资源下载量的一定比例获得贡献点。
（4）乙方有权通过充值平台的VIP获得相应的贡献点。
（5）乙方注销账户前向平台提供的资源的相关权利状态以及纠纷解决方式不受乙方注销账户的行为的影响。
<view class="red">（6）乙方有权通过贡献点兑换、VIP制来预览甲方提供的资源文件以及阅览相关完整资料与详细介绍，但就匿名上传且未经资源所有者认领的资源只就平台提供的范围内享有限制性的预览权。</view>

<view class="strong">四、免责条款</view>
（1）甲方只是为乙方提供一个服务交易的平台，对于用户所发布的需求的合法性、真实性及其品质，以及其他用户履行交易的能力等，甲方一律不负任何担保责任。
（2）甲方充分尊重原创作者的知识产权。甲方合理信赖乙方上传原创产品,上传者就是原创作者或是已经征得著作权人的同意并与著作权人就相关问题作出了妥善处理。甲方对于有关原创数字产品的买卖以及使用属于合理行为，因此与之有关的知识产权纠纷，甲方不承担任何责任。
（3）乙方要求恢复被已删除非法、侵权文件，必须认真预览甲方免责声明后再提交申请恢复。若恢复后出现非法、侵权行为，由申请恢复者自行承担法律责任，甲方不承担任何法律责任。
（4）以下情形导致的个人信息泄露，甲方免责：
（一）政府部门、司法机关等依照法定程序要求本平台披露个人资料时，本平台将根据执法单位之要求或为公共安全之目的提供个人资料；
（二）由于用户将个人密码告知他人或与他人共享注册账户，由此导致的任何个人资料泄露；
（三）任何由于计算机问题、黑客攻击、计算机病毒侵入或发作、因政府管制而造成的暂时性关闭等影响网络正常经营的不可抗力而造成的个人资料泄露、丢失、被盗用或被窜改等；
（四）由于与本平台链接的其他平台所造成之个人资料泄露；
（5）因不可抗力或者其他意外事件，使得本合同的履行不可能、不必要或者无意义的，双方均不承担责任。本合同所称之不可抗力意指不能预见、不能避免并不能克服的客观情况，该事件妨碍、影响或延误本平台履行其全部或部分义务，包括但不限于战争、台风、水灾、火灾、雷击或地震、罢工、暴动、法定疾病、黑客攻击、网络病毒、电信部门技术管制、政府行为或任何其它自然或人为造成的灾难等客观情况。
（6）除甲方注明之服务条款外，其他一切因使用本平台而引致之任何意外、疏忽、诽谤、知识产权侵犯及其所造成的损失（包括因下载而感染电脑病毒），本平台不承担任何法律责任。
第七条 若因本平台产生任何诉诸于诉讼程序的法律争议，均以甲方所在地法院为管辖法院。

<view class="strong">五、违约责任</view>
（1）甲方没有按照合同要求履行甲方应承担的责任，则由甲方承担由此带来的后果。若对乙方权益造成损害，则要求甲方立即停止侵害、及时弥补乙方损失。
（2）甲方未及时向乙方支付报酬的，乙方可要求甲方及时支付报酬，若逾期三个月未及时支付报酬，则加收10%的违约费用。
（3）甲方无正当理由提前终止、解除或者撤销协议的，已支付乙方的费用乙方可不退还，未支付费用，乙方有权要求甲方支付费用。
（4）乙方违反本合同约定造成甲方收到相关部门处罚或对第三方承担责任的，乙方应当赔偿因此给甲方造成的全部损失。
（5）乙方无正当理由提前终止、解除或者撤销协议的，应退还甲方已支付费用，承担甲方损失，并支付甲方合同总金额20%的违约金。
（6）若乙方提供的内容有侵害他人知识产权或其他权利，乙方应当负责与被侵权方交涉，并承担可能发生的一切法律责任和费用。若因被侵权方的侵权指控成立而造成甲方损失的，乙方应当向甲方承担由此造成的一切直接或间接损失；甲方因处理与第三方之合法权益纠纷而支出的一切费用，包括但不限于律师费和诉讼费，甲方有权向乙方追偿。同时，平台可对作者采取包括但不限于暂停服务，限制、冻结或终止账号使用，扣取账户余额，不支付收益，解除双方间的服务协议和法律关系，追究法律责任等措施。
（7）本合同自签订之日起生效，任何一方违反本合同约定的，都应赔偿因此给守约方造成的损失。

（特别说明：本合同一式贰份，甲方一份，乙方一份，具有同等法律效力）
		</view>
		<view v-if="!is_sign">
			<!-- 签名 -->
			<view class="signature">
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
			<button style="background-color: #5d7092;" @click="showSign=true">进入签名</button>
			<button v-if="signUrl" @click="confirm">确认</button>
		</view>
		<view v-else class="signed center">
			已签署合同
		</view>
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
			contractImg: [
				"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/contract1.png",
				"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/contract2.png",
				"https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/contract3.png",
			],
			showSign: false,
			signUrl: "",
			name: "",
			is_sign: getApp().globalData.gUserInfo.signedContract
		}
	},
	methods: {
		readImg(index)
		{
			uni.previewImage({
				urls: this.contractImg,
				current: index
			})
		},
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
			this.$nextTick(() => {
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 10000
				})
			})
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
					console.log(res);
					const data = JSON.parse(res.data)
					if(data.code === 200){
						uni.setStorageSync("token",data.data)
						getApp().globalData.gUserInfo.signedContract = true
						uni.navigateBack({
							delta: 1,
							success: () => {
								this.gToastSuccess(data.msg)
							}
						})
					}
					else{
						this.gToastError(data.msg)
					}
				},
				fail: (err) => {
					console.log(err)
				},
				complete: () => {
					uni.hideLoading()
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
	min-height 100vh
	padding 10px
	white-space pre-wrap
	font-size 26rpx
	&.unmove
		height 100vh
		overflow hidden
	.title .item
		margin 10px 10% 10px 0
		display flex
		.name
			margin-left 5px
			flex 1
			border-bottom var(--border1)
			display flex
			justify-content center
	.indent
		text-indent 52rpx
	.red
		color #F56C6C
	image
		width 100%
		display block
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
	.signed
		margin 10px auto
		color var(--origin2)
</style>
