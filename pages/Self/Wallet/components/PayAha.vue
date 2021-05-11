<!-- 
	充值Aha币弹窗
	author yjl
-->
<template>
	<view class="fix-screen">
		<view class="content">
			<view class="h3 center">Aha币充值</view>
			<view class="small center">(1元 = 1Aha币)</view>
			<view class="balance">
				<text class="label">余额: </text><text class="amount">50</text>
			</view>
			<!-- 预设额度 -->
			<view class="preamount">
				<view 
					class="item"
					:class="selectPreIndex === index ? 'active' : ''"
					v-for="(item,index) in arr_preAmount"
					:key="item"
					@click="selectPreIndex=index;amount=''">
					{{item}}个
				</view>
			</view>
			<!-- 自定义数量,绑定输入值，输入时会清空选择点数 -->
			<input 
				class="self-input" 
				type="number" 
				placeholder="输入充值Aha币数量" 
				@input="selectPreIndex=null" 
				v-model.number="amount">
			<view class="btns">
				<button class="pay" @click="onclickPay">充值</button>
				<button class="cancel" @click="$emit('close')">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			arr_preAmount: [5,10,20,30,50,100],
			selectPreIndex: 0,
			amount: ""
		}
	},
	methods: {
		/**
		 * 点击支付
		 */
		onclickPay() 
		{
			let amount = ""
			if(this.selectPreIndex){
				amount = this.arr_preAmount[this.selectPreIndex]
			}
			else{
				amount = this.amount
			}
			const randomStr = (len) => {
				const strs = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"
				let str = ""
				for(let i=0;i<len;i++){
					str += strs.charAt(Math.floor(Math.random() * strs.length))
				}
				return str
			}
			const formaterTime = (time) => {
				let date = new Date(time);
				let YY = date.getFullYear()
				let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
				let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
				let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
				let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
				return `${YY}-${MM}-${DD}T${hh}:${mm}:${ss}+08:00`
			}
			/* 统一下单接口 */
			const test = {
				out_trade_no: randomStr(30), //订单号
				body: "Aha口袋-Aha币充值",
				detail: `用户"${getApp().globalData.gUserInfo.userInfo.nickname}"充值了${amount}个Aha币,共花费"${amount}元"。`,
				total_fee: amount,
				time_start: formaterTime(Date.now()),
				time_expire: formaterTime(Date.now()+5*60000), //过期时间，5分钟
				goodsTag: "Aha币"
			}
			console.log(test);
			return
			
			const getTime = () => {
				const date = new Date()
				return `wx${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${randomStr(20)}`
			}
			const data = {
				timeStamp: Date.now(),
				nonceStr: randomStr(30),
				package: getTime(),
				signType: 'RSA',
			}
			console.log(data);
			// wx.requestPayment({
			// 	timeStamp: '',
			// 	nonceStr: '',
			// 	package: '',
			// 	signType: 'MD5',
			// 	paySign: '',
			// 	success: (res) => {
			// 		console.log(res)
			// 	},
			// 	fail: (err) => {
			// 		console.log(err)
			// 	}
			// })
			// console.log(amount);
			this.$emit("close")
		}
	}
}
</script>

<style lang="stylus" scoped>
.fix-screen
	.content
		width 90%
		border-radius 8px
		.small
			color var(--gray1)
		.balance
			display flex
			align-items center
			.label
				margin-right 10px
			.amount
				font-size 32rpx
				font-weight 700
				color var(--origin1)
		/* 预设 */
		.preamount
			margin 10px 0
			display grid
			grid-template-columns repeat(3,1fr)
			grid-gap 15px
			.item
				padding 10px
				text-align center
				border 1px solid var(--origin2)
				color var(--origin2)
				border-radius 4px
				font-weight 700
				&.active
					background-color var(--origin2)
					color #FFFFFF
		/* 自定义输入数量 */
		.self-input
			background-color var(--white1)
		.btns
			margin-top 15px
			display flex
			justify-content space-around
			button
				width 35%
			.cancel
				background-color var(--gray1)
</style>
