<template>
	<view class="set-prize">
		<view class="content">
			<view class="h3">获奖情况: </view>
			<inputInfo
				title="比赛名称"
				contentWidth="70%"
				v-model="name">
			</inputInfo>
			<inputInfo
				title="比赛分类"
				type="select"
				contentWidth="400rpx"
				:range="MatchName"
				v-model="matchClassify">
			</inputInfo>
			<inputInfo
				title="获奖等级"
				type="select"
				:range="prizeGrades"
				v-model="grade">
			</inputInfo>
			<view class="date">
				<text>获奖日期: </text>
				<DataPicker
					placeholder="2020-9"
					v-model="date">
				</DataPicker>
			</view>
			<view class="title">获奖证明: <text>长按可删除证明</text></view>
			<view class="prove">
				<image 
					v-if="testifyUrl" 
					:src="testifyUrl" 
					@click="readTestify"
					@longpress="removeTestify">
				</image>
				<text 
					v-else 
					class="iconfont icon-tianjia" 
					@click="addTestify">
				</text>
			</view>
			<view class="btn">
				<button @click="sure">确认</button>
				<button class="close" @click="$emit('close')">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
import inputInfo from "./inputInfo.vue"
export default {
	data() {
		const MatchName = getApp().globalData.MatchName
		const prizeGrades = getApp().globalData.prizeGrades
		return {
			name: "",
			matchClassify: "",
			grade: "",
			date: "",
			testifyUrl: "",
			MatchName, // 比赛名称对应的类型
			prizeGrades, // 获奖等级
		}
	},
	props: {
		prize: {
			type: Object,
			default: null
		},
	},
	methods: {
		/*
			name: 添加获奖证明
			desc: 添加一个获奖证明图片
			input: null
			change: 
							testifyUrl: String,获奖证明
			time: 2020/11/6
		*/
		addTestify()
		{
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success:  (img) => {
					this.testifyUrl = img.tempFilePaths[0]
				}
			})
		},
		/*
			name: 查看获奖证明
			desc: 查看获奖证明图片
			input: 
						this.testifyUrl: String,证明图片地址
			change: 
			time: 2020/11/6
		*/
		readTestify()
		{
			uni.previewImage({
				urls: [this.testifyUrl]
			})
		},
		/* 
			name: 删除获奖证明
			desc: 长按证明图片触发。调用modal提示框，确认后删除证明图片
			change:
						this.testifyUrl: String,证明图片地址
			time: 2020/11/6
		*/
		removeTestify()
		{
			this.gShowModal(
				"确认删除该证明图片?",
				() => {
					this.testifyUrl = ""
				}
			)
		},
		/* 
			name: 获奖情况填写完成
			desc: 检查数据，完成后提交至父组件
		*/
		sure()
		{
			if(this.name === "")
			{
				this.gToastError("获奖名称为空")
				return false
			}
			if(this.matchClassify === "")
			{
				this.gToastError("比赛分类为空")
				return false
			}
			if(this.grade === "")
			{
				this.gToastError("获奖等级为空")
				return false
			}
			if(this.date === "")
			{
				this.gToastError("获奖日期为空")
				return false
			}
			if(this.testifyUrl === "")
			{
				this.gToastError("获奖证明为空")
				return false
			}
			this.$emit("editPrize",{
				name: this.name,
				matchClassify: this.matchClassify,
				grade: this.grade,
				date: this.date,
				testifyUrl: this.testifyUrl,
			})
		}
	},
	created() {
		if(this.prize !== null){
			this.name = this.prize.name
			this.matchClassify = this.prize.matchClassify
			this.grade = this.prize.grade
			this.date = this.prize.date
			this.testifyUrl = this.prize.testifyUrl
		}
	},
	components: {
		inputInfo
	}
}
</script>

<style lang="stylus" scoped>
.set-prize
	position fixed
	z-index 5
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(0,0,0,0.2)
	.content
		position absolute
		margin 0
		bottom 0
		left 0
		right 0
		padding-bottom 80px
		.title
			color var(--origin2)
			font-size 24rpx
		/* 日期 */
		.date
			display flex
			align-items center
			text
				margin-right 10px
				color var(--origin2)
				font-size 24rpx
		/* 证明材料 */
		.prove
			margin 5px auto
			width 95%
			min-height 100px
			background-color var(--origin3)
			border-radius 20px
			display flex
			align-items center
			justify-content center
			overflow hidden
			.iconfont
				color var(--origin1)
				font-size 40rpx
			image
				width 100%
		.btn
			display flex
			justify-content space-between
			button
				width 33%
				&.close
					background-color var(--gray2)
					color var(--white2)
</style>
