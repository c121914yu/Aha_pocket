<!-- 充值Aha币 -->
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
					:class="checkAmount === index ? 'active' : ''"
					v-for="(item,index) in arr_preAmount"
					:key="item"
					@click="checkAmount=index;amount=''">
					{{item}}个
				</view>
			</view>
			<!-- 自定义数量 -->
			<input class="self-input" type="number" placeholder="输入充值Aha币数量" @input="checkAmount=null" v-model.number="amount">
			<view class="btns">
				<button class="pay" @click="pay">充值</button>
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
			checkAmount: 0,
			amount: ""
		}
	},
	methods: {
		/* 支付 */
		pay()
		{
			let amount = ""
			if(this.checkAmount){
				amount = this.arr_preAmount[this.checkAmount]
			}
			else{
				amount = this.amount
			}
			wx.requestPayment({
				timeStamp: '',
				nonceStr: '',
				package: '',
				signType: 'MD5',
				paySign: '',
				success: (res) => {
					console.log(res)
				},
				fail: (err) => {
					console.log(err)
				}
			})
			console.log(amount);
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
