<!-- 我的外包 -->
<template>
	<view class="my-epiboly">
		<view class="navs">
			<view 
				class="nav"
				:class="index === activeNav ? 'active' : ''"
				v-for="(nav,index) in navs"
				:key="index"
				@click="activeNav=index">
				<view>{{nav.name}}</view>
				<view v-if="nav.amount" class="amount">{{nav.amount}}</view>
			</view>
		</view>
		<!-- 列表 -->
		<view 
			class="card"
			v-for="(item,index) in Epibolies"
			:key="index">
			<EpibolyCard :epiboly="item" @click="showMenu(item)"></EpibolyCard>
		</view>
	</view>
</template>

<script>
import EpibolyCard from "./components/EpibolyCard.vue"
export default {
	data() {
		return {
			activeNav: 0,
			navs: [
				{name: "我的接单",type: "11"},
				{name: "待确认",type: "11",amount: 5},
				{name: "进行中",type: "11",amount: 5},
				{name: "已完结",type: "11"},
			],
			Epibolies: [
				{title: "***小程序",description:"大的撒广撒点5广东省十多个ds16g415大嘎达6ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "浙江工业大学",issuer: "****公司",type:0,showmore: true},
				{title: "***网页",description:"大的撒广撒点5广东省十多个ds16g4156ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "远程",issuer: "****公司",type:0,showmore: true},
				{title: "***设计稿",description:"大的撒广撒点5广东省十多个ds16g4156ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "远程",issuer: "****公司",type:0,showmore: true},
				{title: "***设计稿",description:"大的撒广撒点5广东省十多个ds16g4156ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "远程",issuer: "****公司",type:0,showmore: true},
				{title: "***设计稿",description:"大的撒广撒点5广东省十多个ds16g4156ds41g5ds4g5sd",workTime:10,workReward: 1000,place: "远程",issuer: "****公司",type:0,showmore: true},
			]
		}
	},
	components: {
		EpibolyCard
	},
	methods: {
		/* 打开操作面板 */
		showMenu(item)
		{
			switch(this.activeNav){
				case 0: this.menu1(item);break;
				case 1: this.menu2(item);break;
				case 2: this.menu3(item);break;
				case 3: 
						uni.navigateTo({
							url: "./EpibolyDetail"
						});
						break;
			}
		},
		/* 我接的单。菜单内容：查看详细内容，私信发起人 */
		menu1(item)
		{
			uni.showActionSheet({
				itemList: ["查看详细","私信发起人"],
				success: (res) => {
					if (res.tapIndex === 0) {
						uni.navigateTo({
							url: "./EpibolyDetail"
						})
					}
					else if(res.tapIndex === 1){
						uni.navigateTo({
							url: "../Self/Inform_send?id=54"
						})
					}
				}
			})
		},
		/* 待确认单。菜单内容：查看详细内容，取消外包*/
		menu2(item)
		{
			uni.showActionSheet({
				itemList: ["查看详细","取消外包"],
				success: (res) => {
					if (res.tapIndex === 0) {
						uni.navigateTo({
							url: "./EpibolyDetail"
						})
					}
					else if(res.tapIndex === 1){
						this.gToastSuccess("删除外包")
					}
				}
			})
		},
		/* 进行中的外包。菜单内容：查看详细内容，私信接单人，申请取消*/
		menu3(item)
		{
			uni.showActionSheet({
				itemList: ["查看详细","私信接单人","申请取消"],
				success: (res) => {
					if (res.tapIndex === 0) {
						uni.navigateTo({
							url: "./EpibolyDetail"
						})
					}
					else if(res.tapIndex === 1){
						uni.navigateTo({
							url: "../Self/Inform_send?id=54"
						})
					}
					else if(res.tapIndex === 2){
						this.gToastError("申请取消")
					}
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.my-epiboly
	min-height 100vh
	background-color var(--origin4)
	padding 10px 0
	.navs
		display flex
		justify-content space-around
		.nav
			background-color var(--white2)
			padding 5px 10px
			border-radius 8px
			border 1px solid var(--origin1)
			font-size 24rpx
			display flex
			align-items center
			.amount
				margin-left 5px
				width 20px
				height 20px
				text-align center
				line-height 20px
				border-radius 50%
				background-color var(--origin2)
				color #FFFFFF
				font-weight 700
		.active
			background-color var(--origin2)
			color #FFFFFF
			.amount
				background-color #FFFFFF
				color var(--black)
	.card
		margin 10px auto
		width 95%
		box-shadow var(--shadow2)
		border-radius 8px
</style>
