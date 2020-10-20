<template>
	<view class="account-info">
		<!-- 头像 -->
		<image class="avatar" src="../../static/icon/logo.png" mode="widthFix"></image>
		<!-- 各类信息列表 -->
		<!-- 手机号 -->
		<view 
			class="item phone"
			style="animation-delay: .1s">
			<text class="iconfont icon-phone"></text>
			<text class="name">手机号</text>
			<text class="value">15677751219</text>
		</view>
		<!-- 昵称 -->
		<view 
			class="item nickname"
			style="animation-delay: .2s">
			<text class="iconfont icon-huabanfuben"></text>
			<text class="name">昵称</text>
			<input 
				class="value" 
				type="text" 
				placeholder-class="placeholderStyle" 
				placeholder="用户昵称" 
				v-model="nickname"/>
		</view>
		<!-- 性别 -->
		<view 
			class="item gender"
			style="animation-delay: .3s">
			<text class="iconfont icon-icfemale"></text>
			<text class="name">性别</text>
			<!-- 单选框 -->
			<radio-group 
				class="value radio-group"
				@change="gender = $event.detail.value">
				<label>
					<text class="female iconfont icon-icfemale"></text>
					<radio class="radio" value="female" color="#f8b86b" checked="true"/>
				</label>
				<label>
					<text class="male iconfont icon-icmale"></text>
					<radio class="radio" value="male" color="#f8b86b"/>
				</label>
				<label>
					<text class="private iconfont icon-password"></text>
					<radio class="radio" value="private" color="#f8b86b"/>
				</label>
			</radio-group>
		</view>
		<!-- 学校 -->
		<view 
			class="item school"
			style="animation-delay: .4s">
			<text class="iconfont icon-zudui"></text>
			<text class="name">学校</text>
			<picker
				class="value"
				:range="schools"
				@change="school = schools[$event.detail.value]">
				<view :class="school === '' ? 'placeholderStyle' : ''">
					{{school || "选择你的学校"}}
				</view>
			</picker>
		</view>
		<!-- 学院 -->
		<view 
			class="item school"
			style="animation-delay: .5s">
			<text class="iconfont icon-zudui"></text>
			<text class="name">学院</text>
			<picker
				class="value"
				:range="academies"
				@change="academy = academies[$event.detail.value]">
				<view :class="academy === '' ? 'placeholderStyle' : ''">
					{{academy || "选择你的学院"}}
				</view>
			</picker>
		</view>
		<!-- 专业 -->
		<view 
			class="item major"
			style="animation-delay: .6s">
			<text class="iconfont icon-zudui"></text>
			<text class="name">专业</text>
			<picker
				class="value"
				:range="specialties"
				@change="specialty = specialties[$event.detail.value]">
				<view :class="specialty === '' ? 'placeholderStyle' : ''">
					{{specialty || "选择你的专业"}}
				</view>
			</picker>
		</view>
		<!-- 方向 -->
		<view 
			class="item main-learn"
			style="animation-delay: .7s">
			<text class="iconfont icon-huabanfuben"></text>
			<text class="name">学习方向</text>
			<input 
				class="value" 
				type="text" 
				placeholder-class="placeholderStyle" 
				placeholder="你的学习方向" 
				v-model="mainLearn"/>
		</view>
		<view class="remind small center">*该部分信息为公开信息,可被所有用户查看,Aha口袋还会利用部分信息进行推荐算法。</view>
		<view class="save">
			<button @click="save">保存</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			phone: "15677751219",
			nickname: "",
			gender: "female",
			school: "浙江工业大学",
			academy: "",
			specialty : "",
			mainLearn: "",
			schools: ["浙江工业大学","杭州电子科技大学"],
			academies: ["信息工程学院","计算机学院","环境学院"],
			specialties: ["自动化","电子科学与技术","通信工程"]
		}
	},
	methods:{
		save(){
			console.log(this.$data)
		}
	},
	mounted() {
		
	}
}
</script>

<style lang="stylus" scoped>
.account-info
	min-height 100vh
	width 100%
	padding 10px 5%
	background-color var(--origin2)
	padding-bottom 80px
	.avatar
		margin 10px auto
		width 250rpx
		height 250rpx
		border-radius 50%
		display block
	.item
		margin-bottom 20rpx
		padding 6px 10px
		background-color #FFFFFF
		display flex
		align-items center
		border-radius 20px
		opacity 0
		animation itemShow .6s ease forwards
		.iconfont
			font-size 50rpx
			color var(--origin4)
		.name
			margin 0 13px 0 2px
			color var(--origin5)
		.value
			flex 1
			padding 0
	.gender .radio-group
		display flex
		align-items center
		label
			margin-right 20px
			display flex
			align-items center
			.iconfont
				margin-right 5rpx
			.female
				color #188cc9
			.male
				color #ce5d91
			.private
				color var(--gray)
	.remind
		width 90%
		text-align center
		color var(--gray-font)
	.save
		position absolute
		bottom 0
		left 0
		padding 5px 0
		width 100%
		background-color var(--button-bg)
		border-top-left-radius 20px
		border-top-right-radius 20px
		button
			margin 10px auto
			width 70%
			color var(--button-bg)
			background-color #FFFFFF
/* 动画 */
@keyframes itemShow
	to
		opacity 1
</style>
